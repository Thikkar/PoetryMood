import torch
import pickle
import random
from sklearn.feature_extraction.text import TfidfVectorizer
from flask import Flask, request, jsonify
from transformers import GPT2LMHeadModel,  GPT2Tokenizer, GPT2Config, GPT2LMHeadModel

## TODO ##
prompts = ["As a decrepit father takes delight"]

device = torch.device('cuda' if torch.cuda.is_available() else 'cpu')

# classifier
classifier_model = pickle.load(open('poemsclassifier.sav', 'rb'))
vectorizer = pickle.load(open('poemsvectorizer.sav', 'rb'))
encoder = pickle.load(open('poemsencoder.sav', 'rb'))

# generator
tokenizer = GPT2Tokenizer.from_pretrained('gpt2', pad_token='<|pad|>')
configuration = GPT2Config.from_pretrained('gpt2', output_hidden_states=False)
generator_model = GPT2LMHeadModel.from_pretrained("gpt2", config=configuration).to(device)
generator_model.resize_token_embeddings(len(tokenizer))

generator_model.load_state_dict(torch.load('poemsgenerator.pth', map_location=torch.device('cpu')))

api = Flask(__name__)

@api.route('/classify')
def classify():
    poem = request.args.get('poem', default=" ", type=str)
    poem_vectorized = vectorizer.transform([poem]).toarray()
    classification_encoded = classifier_model.predict(poem_vectorized)
    classification = encoder.inverse_transform(classification_encoded)[0]

    response_body = {
        "classification": classification
    }
    response_body = jsonify(response_body)
    response_body.headers.add('Access-Control-Allow-Origin', '*')

    return response_body

@api.route('/generate')
def generate():
    prompt_idx = random.randint(0, len(prompts) - 1)
    prompt = prompts[prompt_idx]
    tokenized_prompt = torch.tensor(tokenizer.encode(prompt)).unsqueeze(0)
    tokenized_prompt = tokenized_prompt

    generated_outputs = generator_model.generate(
                                    tokenized_prompt, 
                                    max_length = 300,
                                    num_return_sequences=3,
                                    num_beams=5,
                                    no_repeat_ngram_size=2, 
                                    early_stopping=True
                                    )

    decoded_poem = tokenizer.decode(generated_outputs[0], skip_special_tokens=True)
    response_body = {
        "poem": decoded_poem
    }
    response_body = jsonify(response_body)
    response_body.headers.add('Access-Control-Allow-Origin', '*')
    
    return response_body

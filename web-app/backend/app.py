import torch
import pickle
import random
from sklearn.feature_extraction.text import TfidfVectorizer
from flask import Flask, request, jsonify
from transformers import GPT2LMHeadModel,  GPT2Tokenizer, GPT2Config, GPT2LMHeadModel

## TODO ##
prompts = ['As a decrepit father takes delight To see his active', 'She hears me strike the board and say That she', 'My father, who I hardly knew, Was never one to', 'We are born as sinners Yet every child is innocent', 'I know where I came from and I know where', '(for ifa, p.t., & bisa) my father is a retired', 'This man who is not my father is my father.', 'My father, my father, I love he, my father, my', 'Dear Lord in Heaven, I hear your voice in the', 'My heart leaps up when I behold A rainbow in', 'Holding the little finger of your hand, Walking on the', "He was No I can't say 'he was' He is", 'He’d grown quite tired by then, but still he tried', 'I arose with my Lord upon my mind And it', 'The father conceives his son the son grows with his', 'Tis The SONG OF LITTLE MARY, Standing at the bar-room', "GOOD Father John O'Hart In penal days rode out To", '"My times are in Thy hand." -- Psalm XXXI.15 Father,', 'Wilt thou forgive that sin where I begun, Which was', 'FATHERS Fathers … They are strong When we need protection.', 'He was always there, my father, constant as gravity. And', 'Father, part of his double interest Unto thy kingdome, thy', 'Father, first of all know how much I love you', "Hey Father Death, I'm flying home Hey poor man, you're", 'Some believe their faith is a private thing, While others', 'was a truly amazing man he pretended to be rich', 'Becoming The Man My Father Always Was (for Brian D)', 'Fathers hold you when you have bad dreams And they', "Come up from the fields, father, here's a letter from", 'Twas the horse thief, Andy Regan, that was hunted like', 'To the Soul That learned Father, who so firmly proves', 'My mother was fortune, my father generosity and bounty; I', 'Dear Lord in Heaven, I woke up this morning with', "Father? Yes...LAWRENCE! 'Did I catch You at a bad time?", 'I feel sorry to myself that ….. I have no', 'During the war, I was in China. Every night we', 'Saturday afternoon, the air, now so hot, and streets busy', 'Father you are always on my mind, I love you', 'He never made a fortune, or a noise In the', 'Master of truth, destroyer of pain, You have the power', 'Dear Lord in heaven, this has been a very interesting', '"You are old, father William," the young man said, "And', 'With my father I would watch dawn over green fields.', 'My father Is my friend... In childhood... I love my', "545 'Tis One by One — the Father counts —", "I never thought I'd live One day to see my", 'Oh father, my father Am humbled by your ways As', 'I realized today that winter would not exist without you,', 'My father knows the proper way The nation should be', 'Up, Timothy, up with your staff and away! Not a']

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
    args = request.args
    prompt_idx = random.randint(0, len(prompts) - 1)
    print(prompt_idx)
    prompt = prompts[prompt_idx]
    prompt = args.get('prompt', default=prompt, type=str)
    print(prompt)
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

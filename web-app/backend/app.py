from flask import Flask, request
import torch
from transformers import GPT2LMHeadModel,  GPT2Tokenizer, GPT2Config, GPT2LMHeadModel

device = torch.device('cuda' if torch.cuda.is_available() else 'cpu')

tokenizer = GPT2Tokenizer.from_pretrained('gpt2', pad_token='<|pad|>')
configuration = GPT2Config.from_pretrained('gpt2', output_hidden_states=False)
model = GPT2LMHeadModel.from_pretrained("gpt2", config=configuration).to(device)
model.resize_token_embeddings(len(tokenizer))

model.load_state_dict(torch.load('poemsgenerator.pth', map_location=torch.device('cpu')))

api = Flask(__name__)

@api.route('/classify')
def classify():
    
    response_body = {
        "classification": "class"
    }

    return response_body

@api.route('/generate')
def generate():
    prompt = request.args.get('prompt', default=" ", type=str)
    tokenized_prompt = torch.tensor(tokenizer.encode(prompt)).unsqueeze(0)
    tokenized_prompt = tokenized_prompt

    generated_outputs = model.generate(
                                    tokenized_prompt, 
                                    do_sample=True,   
                                    top_k=50, 
                                    max_length = 300,
                                    top_p=0.95, 
                                    num_return_sequences=3
                                    )

    decoded_poem = tokenizer.decode(generated_outputs[0], skip_special_tokens=True)
    response_body = {
        "poem": decoded_poem
    }
    return response_body

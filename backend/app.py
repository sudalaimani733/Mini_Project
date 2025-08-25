import torch
import torch.nn.functional as F
from torchvision import transforms
from transformers import ViTForImageClassification, ViTImageProcessor
from flask import Flask, request, jsonify
from PIL import Image
from flask_cors import CORS


app = Flask(__name__)
CORS(app)


# Load model
device = torch.device('cuda' if torch.cuda.is_available() else 'cpu')
model = ViTForImageClassification.from_pretrained('google/vit-base-patch16-224-in21k', num_labels=2)
model.load_state_dict(torch.load('model.pt', map_location=device))
model.to(device)
model.eval()

# Image Processor
processor = ViTImageProcessor.from_pretrained('google/vit-base-patch16-224-in21k')

# Prediction function
def predict_image(img):
    # Transform image
    transform = transforms.Compose([
        transforms.Resize((224, 224)),
        transforms.ToTensor()
    ])
    img = transform(img)
    inputs = processor(images=[img], return_tensors="pt", do_rescale=False)
    inputs = {k: v.to(device) for k, v in inputs.items()}

    # Predict
    with torch.no_grad():
        outputs = model(**inputs)
        logits = outputs.logits
        probs = F.softmax(logits, dim=1)
        pred = torch.argmax(probs, dim=1).item()
    
    # Map prediction to label
    if pred == 0:
        return "Fake"
    else:
        return "Real"

# Route for prediction
@app.route('/predict', methods=['POST'])
def predict():
    if 'image' not in request.files:
        return jsonify({'error': 'No image uploaded'}), 400
    
    image = request.files['image']
    img = Image.open(image.stream).convert('RGB')
    
    prediction = predict_image(img)
    return jsonify({'prediction': prediction})

if __name__ == '__main__':
    app.run(debug=True)

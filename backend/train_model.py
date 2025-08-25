import os
import torch
from torchvision import datasets, transforms
from torch.utils.data import DataLoader
from transformers import ViTForImageClassification, ViTImageProcessor
from sklearn.metrics import classification_report
from tqdm import tqdm

# Use GPU if available
device = torch.device("cuda" if torch.cuda.is_available() else "cpu")

# Image processor
processor = ViTImageProcessor.from_pretrained('google/vit-base-patch16-224-in21k')

# Transform (skip normalization, processor will handle it)
transform = transforms.Compose([
    transforms.Resize((224, 224)),
    transforms.ToTensor()
])

# Load dataset
dataset = datasets.ImageFolder(root='dataset', transform=transform)
dataloader = DataLoader(dataset, batch_size=4, shuffle=True)  # smaller batch

# Show label mapping
label_map = dataset.class_to_idx
print("Label mapping:", label_map)

# Model setup
model = ViTForImageClassification.from_pretrained(
    'google/vit-base-patch16-224-in21k',
    num_labels=2
).to(device)

# Loss and optimizer
criterion = torch.nn.CrossEntropyLoss()
optimizer = torch.optim.Adam(model.parameters(), lr=2e-5)

# Training
model.train()
epochs = 1  # just 1 epoch to test quickly
for epoch in range(epochs):
    total_loss = 0
    for images, labels in tqdm(dataloader):
        # Skip double rescaling
        inputs = processor(images=list(images), return_tensors="pt", do_rescale=False)
        inputs = {k: v.to(device) for k, v in inputs.items()}
        labels = labels.to(device)

        outputs = model(**inputs, labels=labels)
        loss = outputs.loss
        total_loss += loss.item()

        loss.backward()
        optimizer.step()
        optimizer.zero_grad()
    print(f"Epoch [{epoch+1}/{epochs}], Loss: {total_loss:.4f}")

# Save model
torch.save(model.state_dict(), "model.pt")
print("✅ Model training complete and saved as model.pt")

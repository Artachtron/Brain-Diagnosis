# Brain Diseases Diagnosis

<img src="https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/keras/keras-original.svg" title="Keras" width="25" /> <img src="https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/pytorch/pytorch-original.svg" title="PyTorch" width="25" /> <img src="https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/scikitlearn/scikitlearn-original.svg" title="Scikit-learn" width="25" /> <img src="https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/fastapi/fastapi-original.svg" title="FastAPI" width="25" /> <img src="https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/matplotlib/matplotlib-original.svg" title="Matplotlib" width="25" /> <img src="https://seaborn.pydata.org/_images/logo-mark-lightbg.svg" title="Seaborn" width="25" /> <img src="https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/pandas/pandas-original.svg" title="Pandas" width="25" /> <img src="https://raw.githubusercontent.com/xarray-contrib/xarray.dev/main/public/Xarray-assets/Icon/Xarray_Icon_Final.png" title="Xarray" width="25" /> <img src="https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/nextjs/nextjs-original.svg" title="Next.js" width="25" /> <img src="https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/react/react-original.svg" title="React" width="25" /> <img src="https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/materialui/materialui-original.svg" title="Material-UI" width="25" />

## Description

This project leverages transfer learning to train classifiers for analyzing CT scan images, addressing the challenges of limited and unbalanced datasets through data augmentation and cross-validation. The core of the project involves the development of reusable, configurable pipelines that cover the entire process from data preprocessing to results analysis. These pipelines enable the fine-tuning of models based on key metrics like recall and AUC, ensuring optimal performance.

Three distinct models were trained to diagnose Alzheimer's, brain tumors, and brain strokes from CT scans. Each model was deployed via a backend API, which allows for streamlined, automated diagnosis from brain scan images. This API enables model selection and returns diagnosis predictions along with certainty levels, making it an invaluable tool for medical professionals.

A user-friendly frontend interface was developed to facilitate the uploading of CT scan images and the retrieval of diagnostic results. The system supports multiple file uploads, processes the images asynchronously, and provides results as soon as they are ready.

By applying advanced computer vision techniques such as stratified k-fold cross-validation and data augmentation, the project achieved state-of-the-art performance in two out of the three diagnostic tasks. This comprehensive approach ensures that the trained models are robust, accurate, and capable of providing reliable diagnostic support.

## Table of Contents
- [Installation](#installation)
- [Usage](#usage)
  
## Disclaimer

Please note that images, training notebooks, and models are not included in this repository.

Datasets can be downloaded from the following sources:
- Alzheimer's: [Kaggle - Augmented Alzheimer MRI Dataset](https://www.kaggle.com/datasets/uraninjo/augmented-alzheimer-mri-dataset)
- Brain Tumor: [Kaggle - Brain MRI Images for Brain Tumor Detection](https://www.kaggle.com/datasets/navoneel/brain-mri-images-for-brain-tumor-detection)
- Brain Stroke: [Kaggle - Brain Stroke CT Image Dataset](https://www.kaggle.com/datasets/afridirahman/brain-stroke-ct-image-dataset)

If you choose to use your own models, please create a folder within `backend/resources/models`. The models should be in `.h5` file format to be loaded by Keras.


If you choose to use your own models, please create a folder within backend/resources/models. The models should be in .h5 file format to be loaded by Keras.

## Installation

To install and set up this project, follow these steps:

### Frontend

1. **Clone the repository:**

    ```bash
    git clone https://github.com/Artachtron/Brain-Diagnosis.git
    ```

2. **Navigate to the project directory:**

    ```bash
    cd Brain-Diagnosis
    ```

3. **Frontend Setup:**

    ```bash
    # Go to frontend directory
    cd frontend
    
    # Install dependencies
    # Note: npm (Node Package Manager) is required to manage dependencies. 
    # If you don't have npm installed, follow the installation guide at https://docs.npmjs.com/downloading-and-installing-node-js-and-npm
    npm install
    ```

### Backend

1. **Navigate to the backend directory:**

    ```bash
    cd ../backend
    ```

2. **Install dependencies:**

    ```bash
    # Note: Poetry is required to manage dependencies. 
    # If you don't have Poetry installed, follow the installation guide at https://python-poetry.org/docs/#installation
    poetry install
    ```

After completing these steps, your project's frontend and backend will be set up with all necessary dependencies installed.

## Usage

To use this project, follow these steps:

### From Terminal

#### Backend

1. **Navigate to the backend directory:**

    ```bash
    cd backend/src
    ```

2. **Run the backend API:**

    ```bash
    poetry run python api/main.py
    ```

#### Frontend

1. **Navigate to the frontend directory:**

    ```bash
    cd frontend/src
    ```

2. **Run the frontend application:**

    ```bash
    npm run dev
    ```

3. **Access Homepage:**

   Open your web browser and navigate to: [http://localhost:3000/](http://localhost:3000/)


After completing these steps, you should have both the backend API and frontend application running. You can upload CT scan images through the frontend interface and obtain diagnostic results.

### From Container
To use this project from a Docker container, follow these steps:

1. **Ensure Docker is installed and running on your system.**

2. **Navigate to the root folder of the project:**

3. **Run Docker Compose:**

    ```bash
    # Note: Docker and Docker Compose are necessary.
    docker-compose up
    ```
4. **Access Homepage:**

   Open your web browser and navigate to: [http://localhost:3000/](http://localhost:3000/)

After completing these steps, your project's frontend and backend will be set up and running in Docker containers, ready for use.

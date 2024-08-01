# SecurePaw Adoption(Pet Adoption Platform)

## Description:

The SecurePAW is a user-friendly web-based application designed to streamline the adoption process for pets. Our platform aims to connect individuals with regional animal shelters and rescue groups, making it simple and convenient to find and adopt pets in need of loving homes. The website ensures a safe and efficient process for both users and pet shelters by incorporating secure payment options and adhering to PCI DSS compliance standards.

## Objectives:

- Boost responsible pet ownership
- Stimulate pet adoption
- Improve animal welfare
- Acknowledge the positive impact of pet ownership on mental health and community well-being

According to the American Psychiatric Association, "Among pet owners, a strong majority (86%) said their pets have a mostly positive impact on their mental health" (American Psychiatric Association, 2023). Our platform seeks to leverage this benefit by providing visibility into available pets and facilitating the adoption process.

## Project Folder Structure 
```
├── node_modules (.gitignore)
├── public
│   ├── favicon.ico
│   ├── index.html
│   └── manifest.json
├── src
│   ├── assets
│   │   │   ├── images
│   │   │   └── logo.svg
│   ├── constants
│   │   └── data.js
│   ├── components
│   │   ├── app
│   │   │   ├── App.css
│   │   │   ├── App.jsx
│   │   │   └── App.test.js
│   │   └── index.js
│   ├── utils
│   │   ├── ...
│   │   └── index.js
│   ├── index.css
│   ├── index.js
│   ├── serviceWorker.js
│   └── setupTests.js
├── .gitignore
├── package.json
└── README.md
```
## Features

- Browse available pets
- Search for specific pet types, breeds, or characteristics
- View detailed profiles of pets including photos, descriptions, and adoption requirements
- Contact shelters and rescue groups directly through the platform
- Save favorite pets for future reference
- Payment Integration: Secure payment system for donations or adoption fees.
- PCI DSS Compliance: Ensures secure handling of credit card information.

## Technologies Used

- React
- TypeScript
- Azure SQL Server
- Azure Key Vault
- Azure App Service
- GitHub Actions
- CI/CD pipeline
- RESTapi calls

## Installation

To run this project locally, follow these steps:

1. Clone the repository: `git clone https://github.com/yourusername/pet-adoption-platform.git`
2. Navigate to the project directory: `cd pet-adoption-platform`
3. Install dependencies: `npm install`
4. Start the development server: `npm run dev`

## PCI DSS Compliance

As part of our commitment to ensuring the security of payment card data, we conducted a thorough assessment of our project's compliance with the Payment Card Industry Data Security Standard (PCI DSS).

We began by completing the Self-Assessment Questionnaire (SAQ) to evaluate our adherence to PCI DSS requirements. After completing the SAQ, we identified that our project falls under the category SAQ D for Merchants.

Following the recommended process, we proceeded to finish the Self-Assessment Questionnaire D and Attestation of Compliance for Merchants. During this process, we meticulously identified the necessary regulations and implemented measures to address them effectively.

The PCI DSS compliance process ensures that our project meets industry standards for securely handling payment card data, reducing the risk of data breaches and maintaining trust with our users and stakeholders.

The following requirements are mandated:

- Requirement 1: Install and maintain a firewall configuration to protect data.
- Requirement 2: Do not use vendor-supplied defaults for system passwords and other security parameters.
- Requirement 3: Protect stored cardholder data.
- Requirement 4: Encrypt transmission of cardholder data across open, public networks.
- Requirement 5: Protect all systems against malware and regularly update anti-virus software or programs.
- Requirement 6: Develop and maintain secure systems and applications.
- Requirement 7: Restrict access to cardholder data by business need to know.
- Requirement 8: Identify and authenticate access to system components.
- Requirement 9: Restrict physical access to cardholder data.
- Requirement 10: Track and monitor all access to network resources and cardholder data.
- Requirement 11: Regularly test security systems and processes.
- Requirement 12: Maintain a policy that addresses information security for all personnel.
  
## Feasible Regulations

Based on our resources and technical capabilities, the following PCI DSS requirements were identified as feasible for implementation:

- Requirement 1: Install and maintain a firewall configuration to protect data.
- Requirement 3: Protect stored cardholder data.
- Requirement 4: Encrypt transmission of cardholder data across open, public networks.
- Requirement 9: Restrict physical access to cardholder data.

[More details about PCI DSS Implementations](https://github.com/raja045/SecurePaw/wiki/PCI-DSS-requirements)



## Continuous Integration and Deployment

We implemented Continuous Integration and Continuous Deployment (CI/CD) using GitHub Actions to automate the deployment process of our application to Azure App Service. This ensures that any changes made to the source code are automatically built, tested, and deployed to the production environment, reducing manual errors and improving efficiency.

## Contributing

We welcome contributions from the community! If you'd like to contribute to the Pet Adoption Platform, please follow these guidelines:

1. Fork the repository
2. Create a new branch for your feature: `git checkout -b feature-name`
3. Commit your changes: `git commit -am 'Add new feature'`
4. Push to your branch: `git push origin feature-name`
5. Submit a pull request


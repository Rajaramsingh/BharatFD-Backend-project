# BharatFD Backend Project

A multilingual FAQ management system built with Node.js, Express, and MongoDB. Supports automatic translation to many language ( like Hindi and Bengali) with rich text formatting.

## Features

- ✨ Multilingual support (English, Hindi, Bengali)
- 📝 Rich text formatting for FAQs
- 🚀 Automatic translation
- 💾 MongoDB database
- 🔄 RESTful API endpoints
- 📦 Redis caching
- 🔐 User authentication

## Tech Stack

- Node.js & Express.js
- MongoDB (Database)
- Redis (Caching)
- Google Translate API
- JWT (Authentication)

## Installation

1. **Clone the repository**

bash
git clone https://github.com/Rajaramsingh/BharatFD-Backend-project.git
cd BharatFD-Backend-project

2. **Install dependencies**

bash
npm install

3. **Create environment file**
Create a `.env` file:
env
PORT=9999

MONGO_URI=mongodb://localhost:27017/bharat_faqs


4. **Start the server**

bash
npm start


## API Documentation

### Create FAQ

http
POST /api/faqs
Request Body
{
"question": "What is Node.js?",
"answer": "Node.js is a JavaScript runtime built on Chrome's V8 JavaScript engine."
}



### Get FAQs

http
Get FAQs in English
GET /api/faqs?lang=en

Get FAQs in Hindi
GET /api/faqs?lang=hi

Get FAQs in Bengali
GET /api/faqs?lang=bn


## Project Structure

BharatFD-Backend-project/
├── Bharat-FAQs/
│ ├── models/
│ │ └── faq.js
│ ├── routes/
│ │ ├── faqRoutes.js
│ │ ├── userRoutes.js
│ │ └── authRoutes.js
│ ├── services/
│ │ ├── translationService.js
│ │ └── cacheService.js
│ ├── middleware/
│ │ └── auth.js
│ ├── config/
│ │ ├── db.js
│ │ └── redis.js
│ ├── controllers/
│ │ ├── faqController.js
│ │ ├── userController.js
│ │ └── authController.js
│ ├── utils/
│ │ └── errorHandler.js
│ └── server.js
├── node_modules/
├── .env
├── .gitignore
├── package.json
├── package-lock.json
└── README.md



## Installation

1. **Clone the repository**

bash
git clone https://github.com/Rajaramsingh/BharatFD-Backend-project.git
cd BharatFD-Backend-project


2. **Install dependencies**

bash
npm install



3. **Environment Setup**
Create a `.env` file:

env
PORT=9999

MONGO_URI=mongodb://127.0.0.1:27017/bharat_faqs


4. **Start the server**

bash
npm start


## API Documentation

### Create FAQ (POST)

http

POST http://localhost:9999/api/faqs

Request Body

{

"question": "What is Node.js?",
"answer": "Node.js is a JavaScript runtime built on Chrome's V8 JavaScript engine."

}

Response

{

"id": "...",
"question": "What is Node.js?",
"answer": "Node.js is a JavaScript runtime built on Chrome's V8 JavaScript engine.",
"answer_hi": "Node.js Chrome के V8 JavaScript इंजन पर बना JavaScript रनटाइम है।",
"answer_bn": "Node.js হল Chrome এর V8 JavaScript ইঞ্জিনে নির্মিত একটি JavaScript রানটাইম।"

}
### Get FAQs (GET)

http
Get FAQs in English
GET http://localhost:9999/api/faqs?lang=en

Get FAQs in Hindi
GET http://localhost:9999/api/faqs?lang=hi

Get FAQs in Bengali
GET http://localhost:9999/api/faqs?lang=bn


## Dependencies

json

{

"cors": "^2.8.5",
"dotenv": "^16.3.1",
"express": "^4.18.2",
"mongoose": "^8.0.3",
"translate-google": "^1.5.0",
"redis": "^4.6.7", // Add Redis
"bcryptjs": "^2.4.3", // Add bcryptjs
"jsonwebtoken": "^9.0.0" // Add JWT

}



## Features Implemented

1. **FAQ Model**
   - Multilingual support
   - Automatic translation
   - MongoDB integration

2. **API Endpoints**
   - Create FAQ with translations
   - Get FAQs in different languages
   - Language selection via query parameter

3. **Translation Service**
   - English to Hindi translation
   - English to Bengali translation
   - Error handling for translations

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## Author

Rajaram Singh - [GitHub](https://github.com/Rajaramsingh)








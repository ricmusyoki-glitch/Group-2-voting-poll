# Voting Poll App — React Group Project

# Overview

The **Voting Poll App** is a simple and interactive React application that allows users to vote on poll options. It demonstrates core React concepts such as component structure, state management, props, event handling, and data persistence using `localStorage`.

This project is designed as a collaborative mini-project for practicing React development.


# Objectives

Structure a React app using multiple reusable components
Pass data and functions via props
Manage shared state in `App.jsx` using `useState`
Handle user interactions with React events (`onClick`, `onSubmit`, `onChange`)
Persist data using `localStorage`
Understand React data flow (props down, events up)
Build a responsive UI using Tailwind CSS or Bootstrap


# Tech Stack

- React 
- JavaScript XML
- Tailwind CSS 

# Features

- Vote on poll options
- Firebase sign-in before voting
- Email/password authentication
- Google, GitHub, and Twitter social authentication
- Live vote count updates
- Percentage-based progress bars
- One vote per user (buttons disabled after voting)
- Reset all votes with a single click
- Persistent data using `firebase`
- Fully responsive design (mobile & desktop)
- Clean UI with 3 complementary colors


# State Management

All application state is stored in **`App.jsx`**
  Includes:

   - Poll options
   - Vote counts
   - Voting status



# Components

# `App.jsx`

Root component
Holds all state
Handles logic for voting, adding options, and resetting

# `PollForm.jsx`

Input field for adding new poll options
Handles form submission

# `PollList.jsx`

* Renders list of poll options

# `PollOption.jsx`

  Displays:

Option name
Vote count
Percentage bar
Vote button


# Usage

1. Sign in or register with email/password, Google, GitHub, or Twitter
2. Enter a poll option in the input field
3. Click **Add Option**
4. Click **Vote** on your preferred option
5. Observe vote count and percentage update
6. Click **Reset** to clear all votes


# Firebase Authentication Setup

1. Create a Firebase project at https://console.firebase.google.com
2. Add a Web App to the project and copy its Firebase config values
3. Copy `.env.example` to `.env`
4. Fill in every `VITE_FIREBASE_*` value in `.env`
5. In Firebase Console, open **Authentication > Sign-in method**
6. Enable **Email/Password**, **Google**, **GitHub**, and **Twitter**
7. Add your local and deployed domains in **Authentication > Settings > Authorized domains**

# GitHub Pages Deployment

This repo includes a GitHub Actions workflow at `.github/workflows/deploy.yml`.

1. Push the project to GitHub
2. Open **Settings > Pages**
3. Set **Source** to **GitHub Actions**
4. Open **Settings > Secrets and variables > Actions**
5. Add these repository secrets:

VITE_FIREBASE_API_KEY  
VITE_FIREBASE_AUTH_DOMAIN  
VITE_FIREBASE_PROJECT_ID  
VITE_FIREBASE_STORAGE_BUCKET  
VITE_FIREBASE_MESSAGING_SENDER_ID  
VITE_FIREBASE_APP_ID  
VITE_FIREBASE_MEASUREMENT_ID

The workflow runs on pushes to `main` and can also be started manually from the **Actions** tab.



# Contributing

This is a group project with **7 contributors**.
   - fideles Njoki
   - Hiel Sang
   - Immanuel Okoth
   - Joshua Mbilli
   - Ric Musyoki
   - Shadrack Mason
   - Samuel Omari
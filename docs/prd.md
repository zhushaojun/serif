# Product Requirements Document (PRD)

## Overview
Build a modern web application for writing, managing, and publishing blogs. The app will feature a public-facing blog, a secure dashboard for managing content, and integrations for monetization, email, and AI-powered features.

---

## Goals
- Allow users (initially just you) to write, edit, and publish blog posts.
- Enable simple blog management through a secure dashboard.
- Provide a pleasant writing experience with TipTap editor.
- Support user authentication and paid features using Stripe.
- Notify users/readers via email (Resend).
- Use OpenAI for writing suggestions or content improvement.
- Host and deploy seamlessly on Vercel.

---

## Core Pages & Features

### 1. Landing Page
- Brief intro to the blog/app
- Call-to-action (CTA) for signup/login
- List of latest/pinned blog posts (public)
- Clean, attractive design

### 2. Dashboard (Protected)
- Authentication required (Supabase Auth)
- List of all authored blog posts
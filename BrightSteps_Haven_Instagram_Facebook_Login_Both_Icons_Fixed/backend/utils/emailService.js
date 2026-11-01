
import dotenv from 'dotenv';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import nodemailer from 'nodemailer';

const currentFile = fileURLToPath(import.meta.url);
const currentDirectory = path.dirname(currentFile);

dotenv.config({
  path: path.resolve(currentDirectory, '../config.env')
});

const emailConfigured = Boolean(
  process.env.EMAIL_USER?.trim() &&
  process.env.EMAIL_PASS?.trim() &&
  process.env.ADMIN_EMAIL?.trim()
);

console.log('Email configuration loaded:', emailConfigured);

const transporter = emailConfigured
  ? nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER.trim(),
        pass: process.env.EMAIL_PASS.trim()
      }
    })
  : null;

export async function sendAppointmentEmails(appointment) {
  if (!transporter) {
    console.warn('Email is not configured. Appointment was saved without sending email.');
    return;
  }

  const { parentName, email, phone, service, date, message } = appointment;

  await transporter.sendMail({
    from: process.env.EMAIL_USER,
    to: process.env.ADMIN_EMAIL,
    subject: 'New BrightSteps Haven appointment request',
    text: `A new appointment request has been received.

Parent name: ${parentName}
Email: ${email || 'Not provided'}
Phone: ${phone}
Service: ${service}
Preferred date: ${date}

Message:
${message}`
  });

  if (email?.trim()) {
    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: email.trim(),
      subject: 'Appointment request received - BrightSteps Haven',
      text: `Dear ${parentName},

Thank you for contacting BrightSteps Haven.

We have received your appointment request for ${service}, with a preferred date of ${date}.

Your request is pending confirmation. Our team will contact you regarding the next steps.

Regards,
BrightSteps Haven`
    });
  }
}


export async function sendAppointmentStatusEmail(appointment, newStatus) {
  if (!transporter) {
    throw new Error('Email is not configured. Check EMAIL_USER, EMAIL_PASS and ADMIN_EMAIL.');
  }

  const { parentName, email, service, date } = appointment;
  if (!email || !email.trim()) {
    throw new Error('Parent email address is missing.');
  }

  const status = String(newStatus).toLowerCase();
  const messages = {
    confirmed: {
      subject: 'Your appointment is confirmed - BrightSteps Haven',
      message: `Your appointment for ${service}, on ${date}, has been confirmed.\n\nCentre address: ${process.env.CENTRE_ADDRESS || 'Please contact BrightSteps Haven for the centre address.'}`
    },
    cancelled: {
      subject: 'Appointment update - BrightSteps Haven',
      message: `Your appointment for ${service}, on ${date}, has been cancelled. Please contact BrightSteps Haven if you need another date.`
    },
    pending: {
      subject: 'Appointment status update - BrightSteps Haven',
      message: `Your appointment for ${service}, on ${date}, is pending confirmation.`
    }
  };

  const notification = messages[status];
  if (!notification) throw new Error(`Unsupported appointment status: ${newStatus}`);

  await transporter.sendMail({
    from: process.env.EMAIL_USER,
    to: email.trim(),
    subject: notification.subject,
    text: `Dear ${parentName || 'Parent'},\n\n${notification.message}\n\nRegards,\nBrightSteps Haven`
  });
}

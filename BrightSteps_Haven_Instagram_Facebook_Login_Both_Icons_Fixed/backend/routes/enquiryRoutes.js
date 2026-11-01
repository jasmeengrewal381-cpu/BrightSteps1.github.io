
import express from 'express';
import mongoose from 'mongoose';
import { sendAppointmentEmails } from '../utils/emailService.js';

const router = express.Router();

router.post('/', async (req, res) => {
  try {
    if (!req.session?.isParent || !req.session.parentId) {
      return res.status(401).json({ success: false, message: 'Please log in with your parent account before submitting this form.' });
    }
    const {
      name,
      parentName,
      email,
      phone,
      childAge,
      service,
      date,
      subject,
      message
    } = req.body;

    const isAppointment =
      Object.prototype.hasOwnProperty.call(req.body, 'parentName') ||
      Object.prototype.hasOwnProperty.call(req.body, 'service') ||
      Object.prototype.hasOwnProperty.call(req.body, 'date') ||
      Object.prototype.hasOwnProperty.call(req.body, 'childAge');

    if (isAppointment) {
      if (!parentName || !phone || !service || !date || !message) {
        return res.status(400).json({
          success: false,
          message: 'Please fill in your name, phone, service, date and message.'
        });
      }

      const appointment = {
        parentId: new mongoose.Types.ObjectId(req.session.parentId),
        parentName: parentName.trim(),
        email: (email || '').trim(),
        phone: phone.trim(),
        childAge: childAge || '',
        appointmentType: String(req.body.appointmentType || 'Therapy Services').trim(),
        service: service.trim(),
        teamMember: String(req.body.teamMember || '').trim(),
        date,
        message: message.trim(),
        createdAt: new Date()
      };

      await mongoose.connection
        .collection('appointment')
        .insertOne(appointment);

      try {
        await sendAppointmentEmails(appointment);
      } catch (emailError) {
        console.error(
          'Appointment email failed:',
          emailError.message
        );
      }

      return res.status(201).json({
        success: true,
        message: 'Appointment saved successfully.'
      });
    }

    if (!name || !email || !subject || !message) {
      return res.status(400).json({
        success: false,
        message: 'Please fill in your name, email, subject and message.'
      });
    }

    const enquiry = {
      parentId: new mongoose.Types.ObjectId(req.session.parentId),
      name: name.trim(),
      email: email.trim(),
      phone: (phone || '').trim(),
      subject: subject.trim(),
      message: message.trim(),
      createdAt: new Date()
    };

    await mongoose.connection
      .collection('enquiries')
      .insertOne(enquiry);

    return res.status(201).json({
      success: true,
      message: 'Enquiry saved successfully.'
    });

  } catch (error) {
    console.error('Form submission error:', error);

    return res.status(500).json({
      success: false,
      message: 'Could not save your form. Please try again.'
    });
  }
});

export default router;

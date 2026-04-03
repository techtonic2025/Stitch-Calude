import { Router, Response } from 'express';
import { authenticate, AuthRequest } from '../middleware/auth';
import prisma from '../prisma';

const router = Router();

// Mock checkout — simulates a Stripe payment intent creation
router.post('/checkout', authenticate, async (req: AuthRequest, res: Response) => {
  try {
    const { courseId } = req.body;
    const course = await prisma.course.findUnique({ where: { id: courseId } });
    if (!course) {
      res.status(404).json({ error: 'Course not found' });
      return;
    }
    const existing = await prisma.enrollment.findUnique({
      where: { userId_courseId: { userId: req.userId!, courseId } },
    });
    if (existing) {
      res.status(400).json({ error: 'Already enrolled' });
      return;
    }
    // In production, create a real Stripe Payment Intent here
    // For now, return a mock client secret
    const mockClientSecret = `pi_mock_${Date.now()}_secret_${Math.random().toString(36).substring(7)}`;
    res.json({
      clientSecret: mockClientSecret,
      amount: Math.round(course.price * 100),
      currency: 'usd',
      courseTitle: course.title,
    });
  } catch {
    res.status(500).json({ error: 'Server error' });
  }
});

// Called after successful payment to enroll the user
router.post('/confirm', authenticate, async (req: AuthRequest, res: Response) => {
  try {
    const { courseId } = req.body;
    const course = await prisma.course.findUnique({ where: { id: courseId } });
    if (!course) {
      res.status(404).json({ error: 'Course not found' });
      return;
    }
    const enrollment = await prisma.enrollment.upsert({
      where: { userId_courseId: { userId: req.userId!, courseId } },
      update: {},
      create: { userId: req.userId!, courseId },
    });
    await prisma.course.update({
      where: { id: courseId },
      data: { studentsCount: { increment: 1 } },
    });
    res.status(201).json(enrollment);
  } catch {
    res.status(500).json({ error: 'Server error' });
  }
});

export default router;

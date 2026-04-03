import { Router, Request, Response } from 'express';
import prisma from '../prisma';
import { authenticate, AuthRequest } from '../middleware/auth';

const router = Router();

router.get('/', async (req: Request, res: Response) => {
  try {
    const { category, level, search } = req.query;
    const where: Record<string, unknown> = {};
    if (category && category !== 'all') where.category = category;
    if (level && level !== 'all') where.level = level;
    if (search) where.title = { contains: search as string };

    const courses = await prisma.course.findMany({
      where,
      include: { modules: { include: { lessons: true } } },
      orderBy: [{ featured: 'desc' }, { createdAt: 'desc' }],
    });
    res.json(courses);
  } catch {
    res.status(500).json({ error: 'Server error' });
  }
});

router.get('/:slug', async (req: Request, res: Response) => {
  try {
    const course = await prisma.course.findUnique({
      where: { slug: req.params.slug },
      include: {
        modules: { include: { lessons: { orderBy: { order: 'asc' } } }, orderBy: { order: 'asc' } },
        reviews: { include: { user: { select: { name: true } } }, orderBy: { createdAt: 'desc' }, take: 10 },
        _count: { select: { enrollments: true } },
      },
    });
    if (!course) {
      res.status(404).json({ error: 'Course not found' });
      return;
    }
    res.json(course);
  } catch {
    res.status(500).json({ error: 'Server error' });
  }
});

router.post('/:courseId/review', authenticate, async (req: AuthRequest, res: Response) => {
  try {
    const { rating, comment } = req.body;
    const enrolled = await prisma.enrollment.findUnique({
      where: { userId_courseId: { userId: req.userId!, courseId: req.params.courseId } },
    });
    if (!enrolled) {
      res.status(403).json({ error: 'Must be enrolled to review' });
      return;
    }
    const review = await prisma.review.create({
      data: { userId: req.userId!, courseId: req.params.courseId, rating, comment },
      include: { user: { select: { name: true } } },
    });
    res.status(201).json(review);
  } catch {
    res.status(500).json({ error: 'Server error' });
  }
});

export default router;

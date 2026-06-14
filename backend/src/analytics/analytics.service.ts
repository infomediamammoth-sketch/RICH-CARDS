import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class AnalyticsService {
  constructor(private prisma: PrismaService) {}

  async getDashboardStats() {
    // 1. Core aggregates
    const [templatesCount, leadsCount, blogsCount, usersCount] = await Promise.all([
      this.prisma.template.count(),
      this.prisma.lead.count(),
      this.prisma.blog.count(),
      this.prisma.user.count(),
    ]);

    // 2. Leads by status
    const leadsByStatusRaw = await this.prisma.lead.groupBy({
      by: ['status'],
      _count: {
        id: true,
      },
    });

    const leadsByStatus = leadsByStatusRaw.reduce((acc, current) => {
      acc[current.status] = current._count.id;
      return acc;
    }, {} as Record<string, number>);

    // Ensure all standard lifecycle keys are populated
    const statuses = ['New', 'Contacted', 'Interested', 'Closed', 'Rejected'];
    for (const status of statuses) {
      if (!(status in leadsByStatus)) {
        leadsByStatus[status] = 0;
      }
    }

    // 3. Most viewed templates (aggregated from activity logs with action 'VIEW_TEMPLATE')
    const templateViewsRaw = await this.prisma.activityLog.groupBy({
      by: ['details'],
      where: {
        action: 'VIEW_TEMPLATE',
        details: { not: null },
      },
      _count: {
        id: true,
      },
      orderBy: {
        _count: {
          id: 'desc',
        },
      },
      take: 5,
    });

    const popularTemplates = templateViewsRaw.map((item) => {
      return {
        label: item.details || 'Unknown Template',
        views: item._count.id,
      };
    });

    // 4. Templates by category
    const categoriesRaw = await this.prisma.category.findMany({
      include: {
        _count: {
          select: { templates: true },
        },
      },
    });

    const popularCategories = categoriesRaw.map((cat) => ({
      name: cat.name,
      templatesCount: cat._count.templates,
    }));

    // 5. Recent leads
    const recentLeads = await this.prisma.lead.findMany({
      orderBy: { createdAt: 'desc' },
      take: 5,
      include: {
        template: {
          select: { title: true },
        },
      },
    });

    // 6. Recent activity logs
    const recentLogs = await this.prisma.activityLog.findMany({
      orderBy: { createdAt: 'desc' },
      take: 10,
      include: {
        user: {
          select: { name: true, email: true },
        },
      },
    });

    return {
      overview: {
        totalTemplates: templatesCount,
        totalLeads: leadsCount,
        totalBlogs: blogsCount,
        totalUsers: usersCount,
      },
      leadsByStatus,
      popularTemplates,
      popularCategories,
      recentLeads,
      recentLogs,
    };
  }

  async trackPageView(url: string, ipAddress?: string, userAgent?: string) {
    return this.prisma.activityLog.create({
      data: {
        action: 'PAGE_VIEW',
        details: `Page viewed: ${url}`,
        ipAddress: ipAddress || null,
        userAgent: userAgent || null,
      },
    });
  }
}

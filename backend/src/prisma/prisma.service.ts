import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';

@Injectable()
export class PrismaService implements OnModuleInit, OnModuleDestroy {
  private client!: PrismaClient;

  async onModuleInit() {
    const adapter = new PrismaPg({
      connectionString: process.env.DATABASE_URL!,
    });
    this.client = new PrismaClient({ adapter });
  }

  async onModuleDestroy() {
    await this.client?.$disconnect();
  }

  get certification() {
    return this.client.certification;
  }

  get certificationLevel() {
    return this.client.certificationLevel;
  }

  get certificationDomain() {
    return this.client.certificationDomain;
  }

  get certificationTopic() {
    return this.client.certificationTopic;
  }

  get careerRole() {
    return this.client.careerRole;
  }

  get roleCertification() {
    return this.client.roleCertification;
  }

  get careerOpportunity() {
    return this.client.careerOpportunity;
  }

  async $transaction<T>(fn: (tx: PrismaClient) => Promise<T>): Promise<T> {
    return this.client.$transaction(fn);
  }
}

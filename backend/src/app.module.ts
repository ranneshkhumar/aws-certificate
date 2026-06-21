import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './prisma/prisma.module';
import { CertificationsModule } from './certifications/certifications.module';
import { AdminModule } from './admin/admin.module';
import { CareerPathwaysModule } from './career-pathways/career-pathways.module';
import { UploadModule } from './upload/upload.module';

@Module({
  imports: [PrismaModule, CertificationsModule, AdminModule, CareerPathwaysModule, UploadModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}

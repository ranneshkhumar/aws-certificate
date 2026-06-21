import { Controller, Get, Post, Patch, Delete, Put, Param, Body } from '@nestjs/common';
import { AdminService } from './admin.service';
import { CreateCertificationDto } from './dto/create-certification.dto';
import { UpdateCertificationDto } from './dto/update-certification.dto';
import { CreateDomainDto } from './dto/create-domain.dto';
import { UpdateDomainDto } from './dto/update-domain.dto';
import { CreateTopicDto } from './dto/create-topic.dto';
import { UpdateTopicDto } from './dto/update-topic.dto';
import { CreateCareerRoleDto } from './dto/create-career-role.dto';
import { UpdateCareerRoleDto } from './dto/update-career-role.dto';
import { UpdatePathwayDto } from './dto/update-pathway.dto';
import { CreateOpportunityDto } from './dto/create-opportunity.dto';
import { UpdateOpportunityDto } from './dto/update-opportunity.dto';

@Controller('admin')
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  // ── Certification endpoints ──────────────────────────────

  @Post('certifications')
  createCertification(@Body() dto: CreateCertificationDto) {
    return this.adminService.createCertification(dto);
  }

  @Get('certifications')
  findAllCertifications() {
    return this.adminService.findAllCertifications();
  }

  @Get('certifications/:id')
  findCertificationById(@Param('id') id: string) {
    return this.adminService.findCertificationById(id);
  }

  @Patch('certifications/:id')
  updateCertification(
    @Param('id') id: string,
    @Body() dto: UpdateCertificationDto,
  ) {
    return this.adminService.updateCertification(id, dto);
  }

  @Delete('certifications/:id')
  deleteCertification(@Param('id') id: string) {
    return this.adminService.deleteCertification(id);
  }

  // ── Domain endpoints ─────────────────────────────────────

  @Post('certifications/:certificationId/domains')
  createDomain(
    @Param('certificationId') certificationId: string,
    @Body() dto: CreateDomainDto,
  ) {
    return this.adminService.createDomain(certificationId, dto);
  }

  @Patch('domains/:domainId')
  updateDomain(
    @Param('domainId') domainId: string,
    @Body() dto: UpdateDomainDto,
  ) {
    return this.adminService.updateDomain(domainId, dto);
  }

  @Delete('domains/:domainId')
  deleteDomain(@Param('domainId') domainId: string) {
    return this.adminService.deleteDomain(domainId);
  }

  // ── Topic endpoints ──────────────────────────────────────

  @Post('domains/:domainId/topics')
  createTopic(
    @Param('domainId') domainId: string,
    @Body() dto: CreateTopicDto,
  ) {
    return this.adminService.createTopic(domainId, dto);
  }

  @Patch('topics/:topicId')
  updateTopic(
    @Param('topicId') topicId: string,
    @Body() dto: UpdateTopicDto,
  ) {
    return this.adminService.updateTopic(topicId, dto);
  }

  @Delete('topics/:topicId')
  deleteTopic(@Param('topicId') topicId: string) {
    return this.adminService.deleteTopic(topicId);
  }

  // ── Career Role endpoints ────────────────────────────────

  @Post('career-roles')
  createCareerRole(@Body() dto: CreateCareerRoleDto) {
    return this.adminService.createCareerRole(dto);
  }

  @Get('career-roles')
  findAllCareerRoles() {
    return this.adminService.findAllCareerRoles();
  }

  @Get('career-roles/:id')
  findCareerRoleById(@Param('id') id: string) {
    return this.adminService.findCareerRoleById(id);
  }

  @Patch('career-roles/:id')
  updateCareerRole(
    @Param('id') id: string,
    @Body() dto: UpdateCareerRoleDto,
  ) {
    return this.adminService.updateCareerRole(id, dto);
  }

  @Delete('career-roles/:id')
  deleteCareerRole(@Param('id') id: string) {
    return this.adminService.deleteCareerRole(id);
  }

  // ── Pathway endpoints ────────────────────────────────────

  @Put('career-roles/:roleId/pathway')
  updatePathway(
    @Param('roleId') roleId: string,
    @Body() dto: UpdatePathwayDto,
  ) {
    return this.adminService.updatePathway(roleId, dto);
  }

  // ── Career Opportunity endpoints ──────────────────────────

  @Post('career-roles/:roleId/opportunities')
  createOpportunity(
    @Param('roleId') roleId: string,
    @Body() dto: CreateOpportunityDto,
  ) {
    return this.adminService.createOpportunity(roleId, dto);
  }

  @Patch('opportunities/:id')
  updateOpportunity(
    @Param('id') id: string,
    @Body() dto: UpdateOpportunityDto,
  ) {
    return this.adminService.updateOpportunity(id, dto);
  }

  @Delete('opportunities/:id')
  deleteOpportunity(@Param('id') id: string) {
    return this.adminService.deleteOpportunity(id);
  }
}

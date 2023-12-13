import { PartialType } from '@nestjs/mapped-types';
import { SummaryDto } from './create-summary.dto';

export class UpdateSummaryDto extends PartialType(SummaryDto) {}

import { ArgumentMetadata, BadRequestException, PipeTransform } from "@nestjs/common";
import { Types } from "mongoose";



export class ObjectIdValidationPipe implements PipeTransform<string> {
    transform(value: string): string {
        if (!Types.ObjectId.isValid(value)) {
            throw new BadRequestException(`Invalid id format: ${value}`);
        }
        return value;
    }
}
import { SetMetadata } from "@nestjs/common";
import { Roles } from "../dto/roles.enum";

export const ROLES_KEY = 'role';
export const RoleDecorator = (...role: Roles[]) => SetMetadata(ROLES_KEY, role);
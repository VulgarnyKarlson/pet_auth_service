import { CreateUserDto } from 'auth/application/dtos/create-user.dto';
import { User } from 'auth/domain/user.entity';

export interface IUserRepository {
    create(userDto: CreateUserDto): Promise<User>
    findByEmail(email: string): Promise<User>
    findById(id: string): Promise<User>
    update(where: UserWhereUniqueInput, data: Partial<User>): Promise<User>
    updateMany(where: UserWhereInput, data: Partial<User>): Promise<{ count: number }>
}

export interface UserWhereInput {
    and?: UserWhereInput | UserWhereInput[]
    or?: UserWhereInput[]
    not?: UserWhereInput | UserWhereInput[]
    id?: WhereFilter<string> | string
    username?: WhereFilter<string> | string
    email?: WhereFilter<string> | string
    hashAuth?: WhereFilter<string> | string
    hashRefresh?: WhereFilter<string> | string
    createdAt?: WhereFilter<Date> | Date
    updatedAt?: WhereFilter<Date> | Date
}

export interface UserWhereUniqueInput {
    and?: UserWhereUniqueInput | UserWhereUniqueInput[]
    or?: UserWhereUniqueInput[]
    not?: UserWhereUniqueInput | UserWhereUniqueInput[]
    id: string
    username?: string
    email?: string
    hashAuth?: WhereFilter<string> | string
    hashRefresh?: WhereFilter<string> | string
    createdAt?: WhereFilter<Date> | Date
    updatedAt?: WhereFilter<Date> | Date
}

export class WhereFilter<T> {
    readonly and?: WhereFilter<T> | WhereFilter<T>[]
    readonly or?: WhereFilter<T>[]
    readonly not?: WhereFilter<T> | T
    readonly equals?: T
    readonly notEquals?: T
    readonly in?: T[]
    readonly notIn?: T[]
    readonly lt?: T
    readonly lte?: T
    readonly gt?: T
    readonly gte?: T
    readonly contains?: T
    readonly startsWith?: T
    readonly endsWith?: T
}

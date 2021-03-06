import 'reflect-metadata'
import {
    Resolver,
    FieldResolver,
    Root,
    Ctx,
    InputType,
    Field,
    Mutation,
    Arg,
} from 'type-graphql'
import { Context } from '../../config/context'
import { Assignment } from '../../db/entities/Assignment';
import { Professor } from '../../db/entities/Professor';


@InputType()
export class ProfessorCreateInput implements Partial<Professor> {
    @Field()
    email: string;

    @Field()
    name: string;
}

@InputType()
export class ProfessorCreateInputAssignment implements Partial<Professor> {
    @Field()
    email: string;

    @Field()
    name: string;

    @Field()
    assignmentName: string
}


@Resolver(Professor)
export class ProfessorMutation {


    @FieldResolver()
    async assignments(@Root() professor: Professor, @Ctx() ctx: Context): Promise<Assignment[]> {
        return ctx.prisma.professor.findUnique({
            where: {
                email: professor.email
            }
        }).assignments()
    }

    @Mutation((returns) => Professor)
    async createProfessor(
        @Arg('data') data: ProfessorCreateInput,
        @Ctx() ctx: Context
    ): Promise<Professor> {
        return ctx.prisma.professor.create({
            data: {
                email: data.email,
                name: data.name
            }
        })
    }

    @Mutation((returns) => Professor)
    async upsertProfessorWithAssignment(
        @Arg('data') data: ProfessorCreateInputAssignment,
        @Ctx() ctx: Context
    ): Promise<Professor> {

        return ctx.prisma.professor.upsert({
            where: {
                email: data.email
            },
            create: {
                name: data.name,
                email: data.email,
                assignments: {
                    connectOrCreate: [{
                        where: { name: data.assignmentName },
                        create: { name: data.assignmentName }
                    }]
                }
            },
            update: {
                name: data.name,
                assignments: {
                    connectOrCreate: [{
                        where: { name: data.assignmentName },
                        create: { name: data.assignmentName }
                    }]
                }
            }
        })
    }
}
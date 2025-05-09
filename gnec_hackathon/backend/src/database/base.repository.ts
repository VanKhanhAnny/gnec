import {
    ConflictException,
    InternalServerErrorException,
    NotFoundException,
} from '@nestjs/common';
import { Prisma } from '@prisma/client';
export type ModelDelegate = {
    findUnique: (...args: any[]) => Promise<any>;
    findMany: (...args: any[]) => Promise<any>;
    create: (...args: any[]) => Promise<any>;
    update: (...args: any[]) => Promise<any>;
    delete: (...args: any[]) => Promise<any>;
    count: (...args: any[]) => Promise<number>;

};

/**
 * Abstract Base Repository class providing common CRUD operations.
 * Uses simplified parameter types (object) to avoid complex Prisma type indexing issues.
 * Type safety for parameters like 'where', 'data', 'include', 'select' should be
 * enforced by the caller (concrete repository or service) using specific Prisma types.
 *
 * @template TModel The Prisma Model type (e.g., User, Post).
 * @template TDelegate The Prisma Delegate type (e.g., typeof prisma.user).
 */
export abstract class BaseRepository<
    TModel,
    TDelegate extends ModelDelegate
> {
    /**
     * Base Repository Constructor.
     * @param delegate - The specific Prisma model delegate (e.g., prismaService.user)
     * provided by the concrete repository implementation.
     */
    protected constructor(protected readonly delegate: TDelegate) { }

    // --------------- READ OPERATIONS ---------------

    /**
     * Finds a single record based on unique criteria.
     * @param params - Object containing 'where' criteria and optional 'include'/'select'.
     * @returns The found entity or null if not found.
     * @throws {InternalServerErrorException} For unexpected errors.
     */
    async findUnique(params: {
        where: object;
        include?: object;
        select?: object;
    }): Promise<TModel | null> {
        try {
            // Cast delegate to 'any' for simpler method call signature compatibility
            return await (this.delegate as any).findUnique(params) as TModel | null;
        } catch (error) {
            this.logError('findUnique', error, { where: params.where });
            throw new InternalServerErrorException('Error retrieving the record.');
        }
    }

    /**
     * Finds multiple records based on various criteria.
     * @param params - Optional object for filtering, pagination, ordering, selecting, and including.
     * @returns An array of found entities.
     * @throws {InternalServerErrorException} For unexpected errors.
     */
    async findMany(params?: {
        skip?: number;
        take?: number;
        cursor?: object;
        where?: object;
        orderBy?: object | object[];
        select?: object;
        include?: object;
    }): Promise<TModel[]> {
        try {
            return await (this.delegate as any).findMany(params) as TModel[];
        } catch (error) {
            this.logError('findMany', error, { params });
            throw new InternalServerErrorException('Error retrieving records.');
        }
    }

    // --------------- WRITE OPERATIONS ---------------

    /**
     * Creates a new record.
     * @param params - Object containing 'data' for creation and optional 'include'/'select'.
     * @returns The newly created entity.
     * @throws {ConflictException} If a unique constraint violation occurs (P2002).
     * @throws {InternalServerErrorException} For other errors.
     */
    async create(params: {
        data: object;
        include?: object;
        select?: object;
    }): Promise<TModel> {
        try {
            return await (this.delegate as any).create(params) as TModel;
        } catch (error) {
            this.logError('create', error, { data: params.data });
            if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2002') {
                throw new ConflictException(`Unique constraint violation: ${this.getTargetFields(error)}`);
            }
            throw new InternalServerErrorException('Error creating the record.');
        }
    }

    /**
     * Updates an existing record based on unique criteria.
     * @param params - Object containing unique criteria 'where', 'data' for update, and optional 'include'/'select'.
     * @returns The updated entity.
     * @throws {NotFoundException} If the record to update is not found (P2025).
     * @throws {ConflictException} If a unique constraint violation occurs (P2002).
     * @throws {InternalServerErrorException} For other errors.
     */
    async update(params: {
        where: object;
        data: object;
        include?: object;
        select?: object;
    }): Promise<TModel> {
        try {
            return await (this.delegate as any).update(params) as TModel;
        } catch (error) {
            this.logError('update', error, { where: params.where });
            if (error instanceof Prisma.PrismaClientKnownRequestError) {
                if (error.code === 'P2025') throw new NotFoundException('Record to update not found.');
                if (error.code === 'P2002') throw new ConflictException(`Unique constraint violation: ${this.getTargetFields(error)}`);
            }
            throw new InternalServerErrorException('Error updating the record.');
        }
    }

    /**
     * Deletes an existing record based on unique criteria.
     * @param params - Object containing unique criteria 'where' and optional 'include'/'select'.
     * @returns The deleted entity.
     * @throws {NotFoundException} If the record to delete is not found (P2025).
     * @throws {InternalServerErrorException} For other errors.
     */
    async delete(params: {
        where: object;
        include?: object;
        select?: object;
    }): Promise<TModel> {
        try {
            return await (this.delegate as any).delete(params) as TModel;
        } catch (error) {
            this.logError('delete', error, { where: params.where });
            if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2025') {
                throw new NotFoundException('Record to delete not found.');
            }
            throw new InternalServerErrorException('Error deleting the record.');
        }
    }

    // --------------- AGGREGATIONS ---------------

    /**
     * Counts records based on criteria.
     * @param params - Optional object containing 'where' criteria.
     * @returns The number of matching records.
     * @throws {InternalServerErrorException} For unexpected errors.
     */
    async count(params?: {
        where?: object;
    }): Promise<number> {
        try {
            // Use 'any' cast as count might not strictly conform to simplified ModelDelegate definition
            return await (this.delegate as any).count(params);
        } catch (error) {
            this.logError('count', error, { where: params?.where });
            throw new InternalServerErrorException('Error counting records.');
        }
    }

    // --------------- HELPERS ---------------

    /**
     * Logs errors encountered during repository operations.
     * Replace with a more robust logging solution (e.g., NestJS Logger) if needed.
     */
    protected logError(message: string, error: any, context?: Record<string, unknown>): void {
        console.error(`[${this.constructor.name}] ${message}`, {
            error: error?.message ?? error,
            code: error?.code, // Log Prisma error code if available
            context,
        });
    }

    /**
     * Extracts target fields from Prisma P2002 error metadata for better error messages.
     */
    protected getTargetFields(error: any): string {
        // Check if meta and target exist and if target is an array
        if (error?.meta?.target && Array.isArray(error.meta.target)) {
            return error.meta.target.join(', ');
        }
        return 'details unavailable';
    }
}
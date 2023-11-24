import type { Request, Response } from 'express';
import type { AuthRequest } from '../../../../middlewares/auth';
import { PaginationService } from '../../../../utils/PaginationUtil';
import { ForbiddenError, NotFoundError } from '../../../../errors/BasicError';
import { UserSanctionCommentService } from './UserSanctionCommentService';

export class UserSanctionController {
  static async getAll(request: Request, res: Response) {
    const req = request as AuthRequest;
    const params = { ...req.query, ...req.body };
    const pagination = PaginationService.from(params);
    const scope = req.scope || null;
    const sanctionId = req.params.sanctionId;

    const data = await UserSanctionCommentService.getAll(pagination, { sanctionId }, { count: true, scope });

    res.status(200).json(data);
  }

  static async getOne(request: Request, res: Response) {
    const req = request as AuthRequest;
    const scope = req.scope || null;
    const { commentId } = req.params;

    const data = await UserSanctionCommentService.getOne(commentId, { scope });

    if (!data) throw NotFoundError('comment not found', { logit: false });

    res.status(200).json(data);
  }

  static async createOne(request: Request, res: Response) {
    const req = request as AuthRequest;

    const body = {
      comment: req.body.comment,
      senderId: req.user.id,
      sanctionId: req.params.sanctionId,
      createdById: req.user.id,
      updatedById: req.user.id,
    };

    const data = await UserSanctionCommentService.createOne(body);

    res.status(201).json(data);
  }

  static async updateOne(request: Request, res: Response) {
    const req = request as AuthRequest;
    const { commentId } = req.params;

    const comment = await UserSanctionCommentService.getOne(commentId);
    if (!comment) throw NotFoundError('comment not found', { logit: false });
    if (comment.senderId !== req.user.id) throw ForbiddenError("can't edit this comment", { logit: false });

    const body = { comment: req.body.comment, edited: true, updatedById: req.user.id };
    await UserSanctionCommentService.updateOne(commentId, body);

    res.status(200).send();
  }

  static async deleteOne(request: Request, res: Response) {
    const req = request as AuthRequest;
    const { commentId } = req.params;
    const user = req.user;

    const comment = await UserSanctionCommentService.getOne(commentId);
    if (!comment) throw NotFoundError('comment not found', { logit: false });

    if (comment.senderId !== user.id || !user.hasPermissions('user.sanction.manage'))
      throw ForbiddenError("can't delete this comment", { logit: false });

    await UserSanctionCommentService.deleteOne(commentId);

    res.status(204).json();
  }
}

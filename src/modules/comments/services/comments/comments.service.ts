import { Injectable, Inject, forwardRef } from '@nestjs/common';
import { ReturnModelType, DocumentType } from '@typegoose/typegoose';
import { InjectModel } from 'nestjs-typegoose';
import { Types } from 'mongoose';
import { MoviesService } from '../../../movies/services/movies/movies.service';
import { Movies } from '../../../movies/models/movies/movies.model';
import { CreateCommentDto } from '../../dtos/create-comment/create-comment.dto';
import { UpdateCommentDto } from '../../dtos/udpate-comment/update-comment.dto';
import { ReplyCommentDto } from '../../dtos/reply-comment/reply-comment.dto';
import { FindParams } from '../../interfaces/find-params/find-params.interface';
import { findParamsDefault } from '../../constants/find-params/find-params.default.constant';
import { Comments } from '../../models/comments/comments.model';

@Injectable()
export class CommentsService {
  constructor(
    @InjectModel(Comments) public readonly commentsModel: ReturnModelType<typeof Comments>,
    @Inject(forwardRef(() => MoviesService)) public readonly moviesService: MoviesService,
  ) {}

  async getAll({
    sortBy = findParamsDefault.sortBy,
    sortDir = findParamsDefault.sortDir,
    skip = findParamsDefault.skip,
    limit = findParamsDefault.limit,
  }: FindParams = findParamsDefault) {
    const commentsQuery = this.commentsModel.find();

    if (sortBy && sortDir) {
      commentsQuery.sort({ [sortBy]: sortDir.toUpperCase() === 'ASC' ? 1 : -1 });
    }

    if (skip) {
      commentsQuery.skip(parseInt(skip as any, 10));
    }

    if (limit) {
      commentsQuery.limit(parseInt(limit as any, 10));
    }

    const allMovies = await commentsQuery.exec();

    return allMovies;
  }

  async getAllCount() {
    const commentsQuery = this.commentsModel.find({});

    const allCount = await commentsQuery.countDocuments().exec();

    return allCount;
  }

  async populateRecursive(comment: DocumentType<Comments>) {
    if (comment?.children?.length) {
      comment.populate('children');

      await comment.execPopulate();

      comment.children = (await Promise.all(
        comment.children.map(async (childComment: DocumentType<Comments>) => this.populateRecursive(childComment)),
      )) as any;
    }

    return comment;
  }

  async getById(
    commentId: string | Types.ObjectId,
    { recursive = false }: { recursive: boolean } = { recursive: false },
  ) {
    const comment = await this.commentsModel.findById(commentId).exec();

    if (recursive && comment?.children.length) {
      comment.children = (await this.populateRecursive(comment)).children;
    }

    return comment;
  }

  async create(createCommentDto: CreateCommentDto, movie: DocumentType<Movies>) {
    const comment = await this.commentsModel.create({
      movie: createCommentDto.movieId,
      comment: createCommentDto.comment,
    });

    await this.moviesService.addCommentToMovie(comment, movie);

    return comment;
  }

  async update(comment: DocumentType<Comments>, updateCommentDto: UpdateCommentDto) {
    const proms = [this.updatedById(comment._id, updateCommentDto)];

    return await Promise.all(proms);
  }

  async updatedById(commentId: string | Types.ObjectId, updateCommentDto: UpdateCommentDto) {
    const updatedComment = await this.commentsModel
      .findByIdAndUpdate(commentId, { $set: { ...updateCommentDto, updatedAt: new Date() } })
      .exec();

    return updatedComment;
  }

  async updatedByIdWithDoc(commentId: string | Types.ObjectId, updateCommentDoc: any) {
    const updatedComment = await this.commentsModel.findByIdAndUpdate(commentId, { $set: updateCommentDoc }).exec();

    return updatedComment;
  }

  async reply(comment: DocumentType<Comments>, replyCommentDto: ReplyCommentDto) {
    const childComment = await this.commentsModel.create({
      movie: comment.movie,
      comment: replyCommentDto.comment,
      parent: comment._id,
    });

    const updatedParentComment = await this.commentsModel.findByIdAndUpdate(
      comment._id,
      { $push: { children: childComment } },
      { new: true },
    );

    return childComment;
  }

  private _flattenChildrenCommentIdsRec(
    childrenComments: Array<DocumentType<Comments> & { children: Array<DocumentType<Comments>> }>,
    commentIdsAccumulator: Array<string | Types.ObjectId>,
  ) {
    childrenComments.forEach(childComment => {
      commentIdsAccumulator.push(childComment._id);

      this._flattenChildrenCommentIdsRec(
        childComment.children as Array<DocumentType<Comments> & { children: Array<DocumentType<Comments>> }>,
        commentIdsAccumulator,
      );
    });

    return commentIdsAccumulator;
  }

  flattenChildrenCommentIds(
    childrenCommentsTree: Array<DocumentType<Comments> & { children: Array<DocumentType<Comments>> }>,
  ) {
    return this._flattenChildrenCommentIdsRec(childrenCommentsTree, []);
  }

  async remove(comment: DocumentType<Comments>) {
    const proms = [];

    const childrenCommentsTree = await Promise.all(
      comment.children.map(async childCommentId => this.getById(childCommentId as Types.ObjectId, { recursive: true })),
    );

    const flattenChildrenCommentIds = this.flattenChildrenCommentIds(
      childrenCommentsTree as Array<DocumentType<Comments> & { children: Array<DocumentType<Comments>> }>,
    );

    const commentIdsToRemove = flattenChildrenCommentIds.concat([comment._id]);

    const removeCommentIdsProm = this.commentsModel.deleteMany({ _id: { $in: commentIdsToRemove } }).exec();

    const updateParentProm = comment.parent
      ? this.commentsModel.findByIdAndUpdate(comment.parent, { $pull: { children: comment._id } }, { new: true }).exec()
      : Promise.resolve();

    const updateMovieProm = this.moviesService.removeCommentIdsFromMovieById(
      commentIdsToRemove,
      comment.movie as Types.ObjectId,
    );

    proms.push(removeCommentIdsProm, updateParentProm, updateMovieProm);

    await Promise.all(proms);

    return comment;
  }
}

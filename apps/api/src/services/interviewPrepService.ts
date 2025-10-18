import type {
  CreateInterviewPrepPayload,
  InterviewPrep,
  UpdateInterviewPrepPayload,
} from '@fehub/types'

import { interviewPrepRepository } from '../repositories/interviewPrepRepository'

export const interviewPrepService = {
  async list(): Promise<InterviewPrep[]> {
    return interviewPrepRepository.list()
  },

  async getById(id: string): Promise<InterviewPrep | undefined> {
    return interviewPrepRepository.getById(id)
  },

  async create(payload: CreateInterviewPrepPayload): Promise<InterviewPrep> {
    return interviewPrepRepository.create(payload)
  },

  async update(id: string, updates: UpdateInterviewPrepPayload): Promise<InterviewPrep | null> {
    return interviewPrepRepository.update(id, updates)
  },

  async remove(id: string): Promise<boolean> {
    return interviewPrepRepository.remove(id)
  },
}

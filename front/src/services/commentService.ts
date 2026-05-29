import api from "./api";

type CommentPayload = {
  content: string;
  transactionId: number;
};

export const commentService = {
  async getByTransaction(transactionId: number) {
    const { data } = await api.get(`/comment/getcomments/${transactionId}`)
    return data.comments ?? []
  },

  async create(payload: CommentPayload) {
    const { data } = await api.post("/comment/create", payload)
    return data.comment
  },

  async remove(id: number) {
    await api.delete(`/comment/delete/${id}`)
  },
};

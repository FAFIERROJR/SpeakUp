import { Vote } from "./vote";

export class Comment{
    commentKey: string
    content: string
    server_time: number
    user_date: string
    user_time: string
    username: string
    points: number = 0
    vote_history: Vote
}
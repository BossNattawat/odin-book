import { Heart, MessageCircle } from "lucide-react";
import Image from "next/image";

interface Author {
  username: string
  displayName: string
}

interface Post {
  id: string
  author: Author
  authorId: string
  content: string
  commentCount: number
  likeCount: number
  createdAt: string
}

interface PostProps {
  post: Post;
}

function Post({ post } : PostProps) {
  return (
    <div className="flex flex-col gap-y-3 border-b-[1px] border-slate-600 py-3 px-8">
      <div className="flex gap-3 items-center">
        <Image
          src="/avatar.png"
          alt="profile"
          width={40}
          height={40}
          className="rounded-full"
        />
        <div className="flex flex-col gap-x-1">
          <p className="font-semibold">{post.author.displayName}</p>
          <p className="text-gray-400">@{post.author.username}</p>
        </div>
      </div>
      <div className="">
        <p className="text-lg">{post.content}</p>
      </div>
      <div className="flex">
        <ul className="flex w-full gap-15">
          <li className="flex items-center gap-1 cursor-pointer">
            <MessageCircle size={18} /> {post.commentCount}
          </li>
          <li className="flex items-center gap-1 cursor-pointer">
            <Heart size={18} /> {post.likeCount}
          </li>
        </ul>
      </div>
    </div>
  );
}

export default Post;

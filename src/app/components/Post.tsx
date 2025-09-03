import axios from "axios";
import { Heart, MessageCircle } from "lucide-react";
import { useSession } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";
import { useState, useEffect } from "react";

interface Author {
  username: string;
  displayName: string;
  profilePic: string;
}

interface Post {
  id: string;
  author: Author;
  authorId: string;
  content: string;
  commentCount: number;
  likeCount: number;
  createdAt: string;
}

interface PostProps {
  post: Post;
  initiallyLiked?: boolean;
}

function Post({ post, initiallyLiked = false }: PostProps) {
  const { data: session } = useSession();

  const [liked, setLiked] = useState<boolean>(initiallyLiked);
  const [likeCount, setLikeCount] = useState(post.likeCount);

  useEffect(() => {
    setLiked(initiallyLiked);
  }, [initiallyLiked]);

  async function likePost(postId: string) {
    try {
      const data = {
        username: session?.user.username,
        postId: postId,
      };

      await axios.post("/api/posts/like", data);

      setLiked(!liked);
      setLikeCount((prev) => prev + (liked ? -1 : 1));
    } catch (error) {
      console.error("Error liking post:", error);
    }
  }

  return (
    <div className="flex flex-col gap-y-3 border-b-[1px] border-slate-600 py-3 px-8">
      <div className="flex gap-3 items-center">
        <Image
          src={post.author.profilePic || "/avatar.png"}
          alt="profile"
          width={40}
          height={40}
          className="rounded-full object-cover"
        />
        <div className="flex flex-col gap-x-1">
          <Link href={`/profile/${post.author.username}`} className="font-semibold">{post.author.displayName}</Link>
          <p className="text-gray-400">@{post.author.username}</p>
        </div>
      </div>
      <Link href={`/profile/${post.author.username}/post/${post.id}`}>
        <p className="text-lg">{post.content}</p>
      </Link>
      <div className="flex">
        <ul className="flex w-full gap-15">
          <li className="flex items-center gap-1 cursor-pointer">
            <MessageCircle size={18} /> {post.commentCount}
          </li>
          <li
            className="flex items-center gap-1 cursor-pointer"
            onClick={() => likePost(post.id)}
          >
            <Heart
              size={18}
              className={liked ? "text-red-500 fill-red-500" : ""}
            />
            {likeCount}
          </li>
        </ul>
      </div>
    </div>
  );
}

export default Post;

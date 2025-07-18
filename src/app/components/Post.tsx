import { Heart, MessageCircle } from "lucide-react";

function Post({ displayname, username, content, likes, comments }) {
  return (
    <div>
      <p className="flex gap-x-2">
        <span className="font-semibold">{displayname}</span>
        <span>@{username}</span>
      </p>
      <article>
        <p className="text-lg">{content}</p>
      </article>
      <section className="flex">
        <ul className="flex w-full gap-15">
          <li className="flex items-center gap-1 cursor-pointer">
            <MessageCircle size={18} /> {comments.length}
          </li>
          <li className="flex items-center gap-1 cursor-pointer">
            <Heart size={18} /> {likes.length}
          </li>
        </ul>
      </section>
    </div>
  );
}

export default Post;

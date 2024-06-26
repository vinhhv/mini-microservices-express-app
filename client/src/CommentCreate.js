import axios from "axios";
import React, { useState } from "react";

export default function CommentCreate({ postId }) {
  const [content, setContent] = useState("");

  const onSubmit = async (e) => {
    e.preventDefault();

    try {
      await axios.post(`http://posts.com/posts/${postId}/comments`, {
        content,
      });

      setContent("");
    } catch (error) {
      console.log(error);
    } finally {
      setContent("");
    }
  };

  return (
    <div>
      <form onSubmit={onSubmit}>
        <div className="form-group">
          <label>New Comment</label>
          <input
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="form-control"
          />
        </div>
        <button className="btn btn-primary">Submit</button>
      </form>
    </div>
  );
}

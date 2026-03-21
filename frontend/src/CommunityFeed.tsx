import { useEffect, useState } from 'react';
import { getApiBase } from './api';

function getFingerprint(): string {
  let fp = localStorage.getItem('bw-fingerprint');
  if (!fp) {
    fp = crypto.randomUUID?.() || `anon-${Date.now()}-${Math.random().toString(36).slice(2)}`;
    localStorage.setItem('bw-fingerprint', fp);
  }
  return fp;
}

interface Post {
  id: number;
  author: string;
  content: string;
  photoData: string | null;
  createdAt: string;
  likeCount: number;
  loveCount: number;
  commentCount: number;
}

interface Comment {
  id: number;
  author: string;
  content: string;
  createdAt: string;
}

export function CommunityFeed() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [author, setAuthor] = useState('');
  const [content, setContent] = useState('');
  const [photoFile, setPhotoFile] = useState<File | null>(null);
  const [posting, setPosting] = useState(false);
  const [error, setError] = useState('');
  const [expandedId, setExpandedId] = useState<number | null>(null);
  const [comments, setComments] = useState<Record<number, Comment[]>>({});
  const [replyAuthor, setReplyAuthor] = useState('');
  const [replyContent, setReplyContent] = useState('');
  const [replyPostId, setReplyPostId] = useState<number | null>(null);
  const [reactions, setReactions] = useState<Record<number, string | null>>({});

  const loadPosts = () => {
    fetch(`${getApiBase()}/api/community/posts`)
      .then((r) => r.json())
      .then((data) => setPosts(data.posts || []))
      .catch(() => setPosts([]))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    loadPosts();
  }, []);

  const loadComments = (postId: number) => {
    fetch(`${getApiBase()}/api/community/posts/${postId}/comments`)
      .then((r) => r.json())
      .then((data) => setComments((c) => ({ ...c, [postId]: data.comments || [] })));
  };

  const loadReaction = (postId: number) => {
    const fp = getFingerprint();
    fetch(`${getApiBase()}/api/community/posts/${postId}/reaction?fingerprint=${encodeURIComponent(fp)}`)
      .then((r) => r.json())
      .then((data) => setReactions((r) => ({ ...r, [postId]: data.reaction })));
  };

  const resizeImage = (file: File, maxW = 800, maxSizeKB = 400): Promise<string> => {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.onload = () => {
        let w = img.width,
          h = img.height;
        if (w > maxW) {
          h = (h * maxW) / w;
          w = maxW;
        }
        const canvas = document.createElement('canvas');
        canvas.width = w;
        canvas.height = h;
        const ctx = canvas.getContext('2d');
        if (!ctx) return reject(new Error('Canvas not supported'));
        ctx.drawImage(img, 0, 0, w, h);
        let quality = 0.8;
        let dataUrl = canvas.toDataURL('image/jpeg', quality);
        while (dataUrl.length > maxSizeKB * 1024 && quality > 0.3) {
          quality -= 0.1;
          dataUrl = canvas.toDataURL('image/jpeg', quality);
        }
        resolve(dataUrl);
      };
      img.onerror = reject;
      img.src = URL.createObjectURL(file);
    });
  };

  const handlePost = async (e: React.FormEvent) => {
    e.preventDefault();
    setPosting(true);
    setError('');
    let photoData: string | undefined;
    if (photoFile) {
      try {
        photoData = await resizeImage(photoFile);
      } catch {
        setError('Could not process image. Try a smaller file.');
        setPosting(false);
        return;
      }
    }
    try {
      const r = await fetch(`${getApiBase()}/api/community/posts`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ author: author || undefined, content, photoData }),
      });
      const text = await r.text();
      let data: { error?: string } = {};
      try {
        data = text ? JSON.parse(text) : {};
      } catch {
        if (text.startsWith('<')) {
          throw new Error('Server error – backend may not be running. Try again or contact support.');
        }
        throw new Error(text || 'Request failed');
      }
      if (!r.ok) throw new Error(data.error || 'Failed to post');
      setContent('');
      setAuthor('');
      setPhotoFile(null);
      loadPosts();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to post');
    } finally {
      setPosting(false);
    }
  };

  const handleReaction = async (postId: number, type: 'like' | 'love') => {
    const fp = getFingerprint();
    try {
      const r = await fetch(`${getApiBase()}/api/community/posts/${postId}/reaction`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type, fingerprint: fp }),
      });
      const data = await r.json();
      if (r.ok) {
        setPosts((prev) =>
          prev.map((p) =>
            p.id === postId
              ? { ...p, likeCount: data.likeCount, loveCount: data.loveCount }
              : p
          )
        );
        setReactions((prev) => ({
          ...prev,
          [postId]: data.added ? type : reactions[postId] === type ? null : type,
        }));
      }
    } catch {}
  };

  const toggleComments = (postId: number) => {
    if (expandedId === postId) {
      setExpandedId(null);
      setReplyPostId(null);
      setReplyContent('');
      setReplyAuthor('');
    } else {
      setExpandedId(postId);
      setReplyPostId(postId);
      loadComments(postId);
      loadReaction(postId);
    }
  };

  const handleReply = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!replyPostId || !replyContent.trim()) return;
    try {
      const r = await fetch(`${getApiBase()}/api/community/posts/${replyPostId}/comments`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ author: replyAuthor || undefined, content: replyContent }),
      });
      const data = await r.json();
      if (!r.ok) throw new Error(data.error);
      setReplyContent('');
      setReplyAuthor('');
      loadComments(replyPostId);
      setPosts((prev) =>
        prev.map((p) =>
          p.id === replyPostId ? { ...p, commentCount: p.commentCount + 1 } : p
        )
      );
    } catch {}
  };

  if (loading) return <div className="community-loading">Loading community…</div>;

  return (
    <div className="community-feed">
      <form onSubmit={handlePost} className="community-post-form">
        <input
          type="text"
          placeholder="Your name (optional)"
          value={author}
          onChange={(e) => setAuthor(e.target.value)}
          maxLength={50}
          className="community-input-name"
        />
        <textarea
          placeholder="Share something with the community…"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          required
          rows={3}
          className="community-input-content"
        />
        <div className="community-form-actions">
          <label className="community-photo-btn">
            📷 Add photo
            <input
              type="file"
              accept="image/*"
              onChange={(e) => setPhotoFile(e.target.files?.[0] || null)}
              hidden
            />
          </label>
          {photoFile && (
            <span className="community-photo-name">{photoFile.name}</span>
          )}
          <button type="submit" disabled={posting} className="btn btn-primary">
            {posting ? 'Posting…' : 'Post'}
          </button>
        </div>
        {error && <p className="form-error">{error}</p>}
      </form>

      <div className="community-posts">
        {posts.length === 0 ? (
          <p className="community-empty">Be the first to post! Share your thoughts or a photo.</p>
        ) : (
          posts.map((post) => (
            <article key={post.id} className="community-post">
              <div className="community-post-header">
                <strong>{post.author || 'Anonymous'}</strong>
                <span className="community-post-date">
                  {new Date(post.createdAt).toLocaleDateString()}
                </span>
              </div>
              <p className="community-post-content">{post.content}</p>
              {post.photoData && (
                <img
                  src={post.photoData}
                  alt=""
                  className="community-post-photo"
                />
              )}
              <div className="community-post-actions">
                <button
                  type="button"
                  className={`community-reaction ${reactions[post.id] === 'like' ? 'active' : ''}`}
                  onClick={() => handleReaction(post.id, 'like')}
                  title="Like"
                >
                  👍 {post.likeCount}
                </button>
                <button
                  type="button"
                  className={`community-reaction ${reactions[post.id] === 'love' ? 'active' : ''}`}
                  onClick={() => handleReaction(post.id, 'love')}
                  title="Love"
                >
                  ❤️ {post.loveCount}
                </button>
                <button
                  type="button"
                  className="community-comment-btn"
                  onClick={() => toggleComments(post.id)}
                >
                  💬 {post.commentCount}
                </button>
              </div>

              {expandedId === post.id && (
                <div className="community-comments">
                  {(comments[post.id] || []).map((c) => (
                    <div key={c.id} className="community-comment">
                      <strong>{c.author || 'Anonymous'}</strong> {c.content}
                    </div>
                  ))}
                  <form onSubmit={handleReply} className="community-reply-form">
                    <input
                      type="text"
                      placeholder="Your name (optional)"
                      value={replyAuthor}
                      onChange={(e) => setReplyAuthor(e.target.value)}
                      className="community-input-name"
                    />
                    <input
                      type="text"
                      placeholder="Write a reply…"
                      value={replyContent}
                      onChange={(e) => setReplyContent(e.target.value)}
                      required
                      className="community-reply-input"
                    />
                    <button type="submit" className="btn btn-primary btn-sm">
                      Reply
                    </button>
                  </form>
                </div>
              )}
            </article>
          ))
        )}
      </div>
    </div>
  );
}

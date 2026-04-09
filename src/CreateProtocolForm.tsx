import React, { useState } from 'react';
import { createProtocol } from './createProtocol';

type Group = 'controller' | 'emergency' | 'security';

export default function CreateProtocolForm() {
  const [id, setId] = useState<string>('');
  const [title, setTitle] = useState<string>('');
  const [content, setContent] = useState<string>('');
  const [group, setGroup] = useState<Group | ''>('');
  const [headerImage, setHeaderImage] = useState<string>('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!id || !title || !content || !group) {
      alert('Fill required fields');
      return;
    }

    await createProtocol({
      id,
      title,
      content,
      headerImage,
      group,
    });

    alert('Created!');
  };

  return (
    <form onSubmit={handleSubmit} style={styles.container}>
      <input
        placeholder="id (e.g. emergencyShowerProtocol)"
        value={id}
        onChange={(e) => setId(e.target.value)}
        style={styles.input}
      />

      <input
        placeholder="title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        style={styles.input}
      />

      <textarea
        placeholder="content"
        value={content}
        onChange={(e) => setContent(e.target.value)}
        style={{ ...styles.input, height: 120 }}
      />

      <input
        placeholder="headerImage URL"
        value={headerImage}
        onChange={(e) => setHeaderImage(e.target.value)}
        style={styles.input}
      />

      {/* ✅ SELECT GROUP */}
      <select
        value={group}
        onChange={(e) => setGroup(e.target.value as Group)}
        style={styles.input}
      >
        <option value="">Select group</option>
        <option value="controller">Controller</option>
        <option value="emergency">Emergency</option>
        <option value="security">Security</option>
      </select>

      <button type="submit" style={styles.button}>
        Create Protocol
      </button>
    </form>
  );
}

const styles: Record<string, React.CSSProperties> = {
  container: {
    padding: 16,
    display: 'flex',
    flexDirection: 'column',
    gap: 10,
    maxWidth: 400,
  },
  input: {
    border: '1px solid #ccc',
    padding: 10,
    borderRadius: 8,
    fontSize: 14,
  },
  button: {
    padding: 10,
    borderRadius: 8,
    border: 'none',
    backgroundColor: '#4f46e5',
    color: '#fff',
    cursor: 'pointer',
  },
};
import React from 'react';
import Link from 'next/link';
import styles from '../styles/Home.module.css';

export default function Home() {
  return (
    <div className={styles.container}>
      <main className={styles.main}>
        <h1 className={styles.title}>
          Bem-vindo ao Location404
        </h1>

        <p className={styles.description}>
          Sistema de localização e registro de usuários
        </p>

        <div className={styles.grid}>
          <Link href="/registro" className={styles.card}>
            <h2>Registrar-se &rarr;</h2>
            <p>Crie uma nova conta de usuário</p>
          </Link>

          <Link href="/login" className={styles.card}>
            <h2>Login &rarr;</h2>
            <p>Acesse sua conta existente</p>
          </Link>
        </div>
      </main>
    </div>
  );
}
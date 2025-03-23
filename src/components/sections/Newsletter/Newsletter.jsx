import React, { useState } from "react";
import "./Newsletter.scss";

const Newsletter = () => {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    // Here you would typically handle the newsletter subscription
    // For now, we'll just show a success message
    setStatus("success");
    setEmail("");
    setTimeout(() => setStatus(""), 3000);
  };

  return (
    <section className="newsletter">
      <div className="container">
        <div className="newsletter-content">
          <h2 className="newsletter-title">Подпишитесь на наши новости</h2>
          <p className="newsletter-description">
            Получайте первыми информацию о новинках и специальных предложениях
          </p>
          <form className="newsletter-form" onSubmit={handleSubmit}>
            <div className="form-group">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Введите ваш email"
                required
              />
              <button type="submit">Подписаться</button>
            </div>
            {status === "success" && (
              <p className="success-message">
                Спасибо за подписку! Мы отправили вам письмо для подтверждения.
              </p>
            )}
          </form>
        </div>
      </div>
    </section>
  );
};

export default Newsletter;

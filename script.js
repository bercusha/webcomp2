class CommentsSection extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
        this.shadowRoot.innerHTML = `
            <style>
                .comments-container {
                    max-width: 100%;
                }
                textarea {
                    width: 80%;
                    margin-top: 10px;
                    display: block;
                }
            </style>
            <div class="comments-container">
                <textarea id="new-comment" placeholder="Напишите комментарий..."></textarea>
                <button id="add-comment">Добавить комментарий</button>
                <div id="comments-list"></div>
            </div>
        `;
        this.shadowRoot.querySelector('#add-comment').addEventListener('click', () => this.addComment());
    }

    addComment() {
        const commentText = this.shadowRoot.querySelector('#new-comment').value.trim();
        if (commentText === '') {
            alert('Комментарий не может быть пустым');
            return;
        }

        const comment = this.createCommentElement(commentText);
        this.shadowRoot.querySelector('#comments-list').appendChild(comment);
        this.shadowRoot.querySelector('#new-comment').value = '';
    }

    createCommentElement(text) {
        const template = document.getElementById('comment-template').content.cloneNode(true);
        template.querySelector('slot').textContent = text;

        const likeBtn = template.querySelector('.like-button');
        const deleteBtn = template.querySelector('.delete-button');
        const replyBtn = template.querySelector('.reply-button');
        const nestedComments = template.querySelector('.nested-comments');

        likeBtn.addEventListener('click', () => {
            const count = likeBtn.querySelector('.like-count');
            count.textContent = parseInt(count.textContent) + 1;
        });

        deleteBtn.addEventListener('click', () => {
            // Удаление родительского комментария из DOM
            deleteBtn.closest('.comment').remove();
        });

        replyBtn.addEventListener('click', () => {
            const replyText = document.createElement('textarea');
            const submitReply = document.createElement('button');
            submitReply.textContent = 'Отправить';

            submitReply.addEventListener('click', () => {
                const replyComment = this.createCommentElement(replyText.value);
                nestedComments.appendChild(replyComment);
                replyText.remove();
                submitReply.remove();
            });

            nestedComments.appendChild(replyText);
            nestedComments.appendChild(submitReply);
        });

        return template;
    }
}

customElements.define('comments-section', CommentsSection);

export class NotepadOutput {
	constructor(
		root,
		{ onMemoSelect, onMemoAdd, onMemoEdit, onMemoDelete } = {}
	) {
		this.root = root;
		this.onMemoSelect = onMemoSelect;
		this.onMemoAdd = onMemoAdd;
		this.onMemoEdit = onMemoEdit;
		this.onMemoDelete = onMemoDelete;
		this.root.innerHTML = `
            <section class="memos__sidebar">
                <button role="button" class="memos__add" type="button">Добавить заметку</button>
                <p class="memos__reminder"> * Чтобы удалить созданную заметку, дважды щёлкните по ней!</p>
                <div class="memos__list"></div>
            </section>
            <section class="memos__preview">
                <label for="memo-title">
                    <input id="memo-title" class="memos__title" type="text" placeholder="Заголовок">
                </label>
                <label for="memo-main">
                    <textarea id="memo-main" wrap="soft" role="textbox" class="memos__body">Пожалуйста, введите текст заметки</textarea>
                </label>
            </section>
        `;

		const btnAddMemo = this.root.querySelector(".memos__add");
		const inpTitle = this.root.querySelector(".memos__title");
		const inpBody = this.root.querySelector(".memos__body");

		btnAddMemo.addEventListener("click", () => {
			this.onMemoAdd();
		});

		[inpTitle, inpBody].forEach((inputField) => {
			inputField.addEventListener("blur", () => {
				const updatedTitle = inpTitle.value.trim();
				const updatedBody = inpBody.value.trim();

				this.onMemoEdit(updatedTitle, updatedBody);
			});
		});

		this.updateMemoPreviewVisibility(false);
	}

	_createListItemHTML(id, title, body, updated) {
		const MAX_BODY_LENGTH = 60;

		return `
            <div class="memos__list-item" data-memo-id="${id}">
                <div class="memos__little-title">${title}</div>
                <div class="memos__little-body">
                    ${body.substring(0, MAX_BODY_LENGTH)}
                    ${body.length > MAX_BODY_LENGTH ? "..." : ""}
                </div>
                <div class="memos__little-updated">
                    ${updated.toLocaleString(undefined, {
						dateStyle: "full",
						timeStyle: "short",
					})}
                </div>
            </div>
        `;
	}

	updateMemoList(memos) {
		const memosListContainer = this.root.querySelector(".memos__list");

		// Стартовая заметка
		memosListContainer.innerHTML =
			"<div class='memos__list'>" +
			"<div id='start-note' class='memos__list-item memos__list-item--chosen'>" +
			"<div class='memos__little-title'>Стартовая заметка</div>" +
			"<div class='memos__little-body'>Пример в стиле активной заметки. Её вы не сможете удалить.</div>" +
			"<div class='memos__little-updated'>Пятница, 6 мая 2022 г.</div>" +
			"</div>" +
			"</div>";

		for (const memo of memos) {
			const html = this._createListItemHTML(
				memo.id,
				memo.title,
				memo.body,
				new Date(memo.updated)
			);

			memosListContainer.insertAdjacentHTML("beforeend", html);
		}

		// Функции выбора/удаления
		memosListContainer
			.querySelectorAll(".memos__list-item")
			.forEach((memoListItem) => {
				memoListItem.addEventListener("click", () => {
					this.onMemoSelect(memoListItem.dataset.memoId);
				});

				memoListItem.addEventListener("dblclick", () => {
					const doDelete = confirm(
						"Вы точно хотите удалить эту заметку?"
					);

					if (doDelete) {
						this.onMemoDelete(memoListItem.dataset.memoId);
					}
				});
			});
	}

	updateActiveMemo(memo) {
		this.root.querySelector(".memos__title").value = memo.title;
		this.root.querySelector(".memos__body").value = memo.body;

		this.root
			.querySelectorAll(".memos__list-item")
			.forEach((memoListItem) => {
				memoListItem.classList.remove("memos__list-item--chosen");
			});

		this.root
			.querySelector(`.memos__list-item[data-memo-id="${memo.id}"]`)
			.classList.add("memos__list-item--chosen");
	}

	updateMemoPreviewVisibility(visible) {
		this.root.querySelector(".memos__preview").style.visibility = visible
			? "visible"
			: "hidden";
	}
}

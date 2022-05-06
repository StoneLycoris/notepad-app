import { NotepadOutput } from "./NotepadOutput.js";
import { NotepadAPI } from "./NotepadAPI.js";

export class App {
	constructor(root) {
		this.memos = [];
		this.activeMemo = null;
		this.view = new NotepadOutput(root, this._handlers());

		this._refreshMemos();
	}

	_refreshMemos() {
		const memos = NotepadAPI.getAllMemos();

		this._setMemos(memos);

		if (memos.length > 0) {
			this._setActiveMemo(memos[0]);
		}
	}

	_setMemos(memos) {
		this.memos = memos;
		this.view.updateMemoList(memos);
		this.view.updateMemoPreviewVisibility(memos.length > 0);
	}

	_setActiveMemo(memo) {
		this.activeMemo = memo;
		this.view.updateActiveMemo(memo);
	}

	_handlers() {
		return {
			onMemoSelect: (memoId) => {
				const selectedMemo = this.memos.find(
					(memo) => memo.id == memoId
				);
				this._setActiveMemo(selectedMemo);
			},
			onMemoAdd: () => {
				const newMemo = {
					title: "Заголовок",
					body: "Пожалуйста, введите текст заметки",
				};

				NotepadAPI.saveMemo(newMemo);
				this._refreshMemos();
			},
			onMemoEdit: (title, body) => {
				NotepadAPI.saveMemo({
					id: this.activeMemo.id,
					title,
					body,
				});

				this._refreshMemos();
			},
			onMemoDelete: (memoId) => {
				NotepadAPI.deleteMemo(memoId);
				this._refreshMemos();
			},
		};
	}
}

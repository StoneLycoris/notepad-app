export class NotepadAPI {
	static getAllMemos() {
		const memos = JSON.parse(
			localStorage.getItem("memosapp-memos") || "[]"
		);

		return memos.sort((a, b) => {
			return new Date(a.updated) > new Date(b.updated) ? -1 : 1;
		});
	}

	static saveMemo(memoToSave) {
		const memos = NotepadAPI.getAllMemos();
		const existing = memos.find((memo) => memo.id == memoToSave.id);

		// Редактирование и обновление
		if (existing) {
			existing.title = memoToSave.title;
			existing.body = memoToSave.body;
			existing.updated = new Date().toISOString();
		} else {
			memoToSave.id = Math.floor(Math.random() * 1000000);
			memoToSave.updated = new Date().toISOString();
			memos.push(memoToSave);
		}

		localStorage.setItem("memosapp-memos", JSON.stringify(memos));
	}

	static deleteMemo(id) {
		const memos = NotepadAPI.getAllMemos();
		const newMemos = memos.filter((memo) => memo.id != id);

		localStorage.setItem("memosapp-memos", JSON.stringify(newMemos));
	}
}

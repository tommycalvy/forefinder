import { invalidate } from '$app/navigation';

export function enhance(
	form: HTMLFormElement,
	{
		pending,
		error,
		result,
		redirect
	}: {
		pending?: ({ data, form }: { data: FormData; form: HTMLFormElement }) => void;
		error?: ({
			data,
			form,
			response,
			error
		}: {
			data: FormData;
			form: HTMLFormElement;
			response: Response | null;
			error: Error | null;
		}) => void;
		result?: ({
			data,
			form,
			response
		}: {
			data: FormData;
			response: Response;
			form: HTMLFormElement;
		}) => void;
		redirect?: ({
			data,
			form,
			response
		}: {
			data: FormData;
			response: Response;
			form: HTMLFormElement;
		}) => void;
	}
): { destroy(): void } {
	let current_token;

	async function handle_submit(event: SubmitEvent) {
		const token = (current_token = {});

		event.preventDefault();

		const data = new FormData(form);

		if (pending) pending({ data, form });
		console.log('hit submit');
		try {
			const submitName = event.submitter?.getAttribute('name');
			const submitValue = event.submitter?.getAttribute('value');
			if (typeof submitName === 'string' && typeof submitValue === 'string') {
				data.append(submitName, submitValue);
			} else {
				throw new Error('No name or value in submitter element');
			}

			console.log(form.method);
			const response = await fetch(form.action, {
				method: form.method,
				headers: {
					accept: 'application/json'
				},
				body: data
			});
			console.log('Awaiting response');
			console.log(response);
			if (token !== current_token) {
				console.log('token !== current_token');
				return;
			}

			if (response.ok) {
				if (result) result({ data, form, response });

				if (redirect) {
					redirect({ data, form, response });
				} else {
					const url = new URL(form.action);
					url.search = url.hash = '';
					invalidate(url.href);
				}
			} else if (error) {
				error({ data, form, error: null, response });
				console.log('Error from fetch');
			} else {
				console.error(await response.text());
				console.log('Error');
			}
		} catch (err) {
			console.log('Error Caught');
			console.log(err);
			if (error && err instanceof Error) {
				error({ data, form, error: err, response: null });
			} else {
				throw err;
			}
		}
	}

	form.addEventListener('submit', handle_submit);

	return {
		destroy() {
			form.removeEventListener('submit', handle_submit);
		}
	};
}

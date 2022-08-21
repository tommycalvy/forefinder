import type { LayoutServerLoad } from "./$types";
import { auth } from "$lib/auth";

export const load: LayoutServerLoad = async ({ request }) => {

    const { status, data } = await auth.toSession()
}
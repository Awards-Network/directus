import api from '@/api';
import { unexpectedError } from '@/utils/unexpected-error';
import { Role } from '@directus/shared/types';
import { ref, Ref } from 'vue';

let roles: Ref<Role[] | null> | null = null;
let loading: Ref<boolean> | null = null;

export default function useNavigation(): { roles: Ref<Role[] | null>; loading: Ref<boolean> } {
	if (roles === null) {
		roles = ref<Role[] | null>(null);
	}

	if (loading === null) {
		loading = ref(false);
	}

	if (loading?.value === false) {
		fetchRoles();
	}

	return { roles, loading };

	async function fetchRoles() {
		if (!loading || !roles) return;
		if (!roles.value) loading.value = true;

		try {
			const rolesResponse = await api.get(`/roles`, {
				params: {
					sort: 'name',
				},
			});
			roles.value = rolesResponse.data.data;
		} catch (error: any) {
			unexpectedError(error);
		} finally {
			loading.value = false;
		}
	}
}

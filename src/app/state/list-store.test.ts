import { describe, it, expect, vi, beforeEach } from 'vitest';
import { useListStore } from './list-store';
import { listService } from '../services';

vi.mock('../services', () => ({
  listService: {
    remove: vi.fn().mockResolvedValue(undefined),
  },
}));

describe('list-store removeList', () => {
  beforeEach(() => {
    useListStore.setState({ currentListId: undefined, items: [] });
    vi.clearAllMocks();
  });

  it('should reset currentListId when removing the current list', async () => {
    useListStore.setState({ currentListId: 'list-1' });

    await useListStore.getState().actions.removeList('list-1');

    expect(useListStore.getState().currentListId).toBeUndefined();
    expect(listService.remove).toHaveBeenCalledWith('list-1');
  });

  it('should keep currentListId when removing a different list', async () => {
    useListStore.setState({ currentListId: 'list-1' });

    await useListStore.getState().actions.removeList('list-2');

    expect(useListStore.getState().currentListId).toBe('list-1');
    expect(listService.remove).toHaveBeenCalledWith('list-2');
  });
});

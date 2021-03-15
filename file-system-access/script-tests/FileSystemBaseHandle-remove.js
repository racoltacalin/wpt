'use strict';

directory_test(async (t, root) => {
  const handle =
      await createFileWithContents(t, 'file-to-remove', '12345', root);
  await createFileWithContents(t, 'file-to-keep', 'abc', root);
  await handle.remove('file-to-remove');

  assert_array_equals(await getSortedDirectoryEntries(root), ['file-to-keep']);
  await promise_rejects_dom(t, 'NotFoundError', getFileContents(handle));
}, 'remove() to remove a file');

directory_test(async (t, root) => {
  const handle =
      await createFileWithContents(t, 'file-to-remove', '12345', root);
  await handle.remove('file-to-remove');

  await promise_rejects_dom(
      t, 'NotFoundError', handle.remove('file-to-remove'));
}, 'remove() on an already removed file should fail');

directory_test(async (t, root) => {
  const dir = await root.getDirectoryHandle('dir-to-remove', {create: true});
  await createFileWithContents(t, 'file-to-keep', 'abc', root);
  await dir.remove('dir-to-remove');

  assert_array_equals(await getSortedDirectoryEntries(root), ['file-to-keep']);
  await promise_rejects_dom(t, 'NotFoundError', getSortedDirectoryEntries(dir));
}, 'remove() to remove an empty directory');

directory_test(async (t, root) => {
  const dir = await root.getDirectoryHandle('dir-to-remove', {create: true});
  await dir.remove('dir-to-remove');

  await promise_rejects_dom(t, 'NotFoundError', dir.remove('dir-to-remove'));
}, 'remove() on an already removed directory should fail');

directory_test(async (t, root) => {
  const dir = await root.getDirectoryHandle('dir-to-remove', {create: true});
  t.add_cleanup(() => root.removeEntry('dir-to-remove', {recursive: true}));
  await createEmptyFile(t, 'file-in-dir', dir);

  await promise_rejects_dom(
      t, 'InvalidModificationError', dir.remove('dir-to-remove'));
  assert_array_equals(
      await getSortedDirectoryEntries(root), ['dir-to-remove/']);
  assert_array_equals(await getSortedDirectoryEntries(dir), ['file-in-dir']);
}, 'remove() on a non-empty directory should fail');

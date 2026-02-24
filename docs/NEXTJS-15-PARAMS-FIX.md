# Next.js 15 Params Promise Fix

## Problem

Error saat edit atau delete movie:

```
Error: Route "/api/movies/[id]" used `params.id`. 
`params` is a Promise and must be unwrapped with `await` 
or `React.use()` before accessing its properties.
```

```
Error updating movie: {
  code: '22P02',
  details: null,
  hint: null,
  message: 'invalid input syntax for type uuid: "undefined"'
}
```

## Root Cause

### Next.js 15 Breaking Change

Di **Next.js 15**, `params` di dynamic routes sekarang adalah **Promise** yang harus di-await.

### Before (Next.js 14):
```typescript
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }  // ❌ Langsung object
) {
  const id = params.id;  // ❌ Langsung akses
}
```

### After (Next.js 15):
```typescript
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }  // ✅ Promise
) {
  const { id } = await params;  // ✅ Harus await
}
```

## Why This Change?

Next.js 15 membuat `params` async untuk:
1. **Better Performance**: Lazy loading params
2. **Streaming Support**: Support React Server Components streaming
3. **Consistency**: Semua dynamic data sekarang async

## Solution

### Step 1: Update Type Definition

**Before:**
```typescript
{ params }: { params: { id: string } }
```

**After:**
```typescript
{ params }: { params: Promise<{ id: string }> }
```

### Step 2: Await Params

**Before:**
```typescript
const id = params.id;
```

**After:**
```typescript
const { id } = await params;
```

## Complete Fix

### GET Method:
```typescript
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;  // ✅ Await params
    
    const { data, error } = await supabase
      .from('movies')
      .select('*')
      .eq('id', id)  // ✅ Use awaited id
      .single();

    if (error) throw error;
    return NextResponse.json({ movie: data });
  } catch (error) {
    console.error('Error fetching movie:', error);
    return NextResponse.json(
      { error: 'Failed to fetch movie' },
      { status: 500 }
    );
  }
}
```

### PUT Method:
```typescript
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;  // ✅ Await params
    const body = await request.json();
    
    const { data, error } = await supabase
      .from('movies')
      .update(body)
      .eq('id', id)  // ✅ Use awaited id
      .select()
      .single();

    if (error) throw error;
    return NextResponse.json({ movie: data });
  } catch (error) {
    console.error('Error updating movie:', error);
    return NextResponse.json(
      { error: 'Failed to update movie' },
      { status: 500 }
    );
  }
}
```

### DELETE Method:
```typescript
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;  // ✅ Await params
    
    const { error } = await supabase
      .from('movies')
      .delete()
      .eq('id', id);  // ✅ Use awaited id

    if (error) throw error;
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting movie:', error);
    return NextResponse.json(
      { error: 'Failed to delete movie' },
      { status: 500 }
    );
  }
}
```

## Why "undefined" Error?

### Flow of Error:

1. Code tries to access `params.id` directly
2. `params` is a Promise, not an object
3. `params.id` returns `undefined`
4. Database receives `undefined` as UUID
5. PostgreSQL error: "invalid input syntax for type uuid: 'undefined'"

### Visual:

```
params (Promise) → params.id → undefined ❌
                                    ↓
                            Database error!

await params → { id: "uuid" } → id → "actual-uuid" ✅
                                      ↓
                              Database success!
```

## Migration Checklist

For all dynamic routes `[param]`:

- [x] Update type: `params: Promise<{ param: string }>`
- [x] Add await: `const { param } = await params`
- [x] Update all usages: Use destructured variable
- [x] Test GET endpoint
- [x] Test PUT endpoint
- [x] Test DELETE endpoint
- [x] Test POST endpoint (if uses params)

## Common Patterns

### Single Param:
```typescript
{ params }: { params: Promise<{ id: string }> }
const { id } = await params;
```

### Multiple Params:
```typescript
{ params }: { params: Promise<{ id: string; slug: string }> }
const { id, slug } = await params;
```

### Optional Params:
```typescript
{ params }: { params: Promise<{ id?: string }> }
const { id } = await params;
if (!id) return NextResponse.json({ error: 'ID required' }, { status: 400 });
```

## Testing

### Test 1: Edit Movie
1. Click edit button on a movie
2. Change title
3. Save
4. ✅ Success - Movie updated

### Test 2: Delete Movie
1. Click delete button on a movie
2. Confirm deletion
3. ✅ Success - Movie deleted

### Test 3: View Single Movie (if implemented)
1. Navigate to /api/movies/[id]
2. ✅ Success - Movie data returned

## Browser Compatibility

This is a server-side change, so no browser compatibility issues.

## Performance Impact

**Minimal to None:**
- Awaiting params is very fast
- No noticeable performance difference
- Better streaming support in Next.js 15

## Related Changes in Next.js 15

Other async APIs:
- `searchParams` is now Promise
- `cookies()` is now async
- `headers()` is now async

Example:
```typescript
// Before (Next.js 14)
const searchParams = request.nextUrl.searchParams;

// After (Next.js 15)
const searchParams = await request.nextUrl.searchParams;
```

## Documentation

Official Next.js docs:
https://nextjs.org/docs/messages/sync-dynamic-apis

## Files Modified

- `app/api/movies/[id]/route.ts` - Fixed GET, PUT, DELETE methods

## Conclusion

**Problem:** Next.js 15 made `params` async
**Solution:** Await params before accessing properties
**Result:** ✅ Edit and delete functionality working
**Impact:** Breaking change, requires code update

## Quick Reference

```typescript
// ❌ OLD (Next.js 14)
{ params }: { params: { id: string } }
const id = params.id;

// ✅ NEW (Next.js 15)
{ params }: { params: Promise<{ id: string }> }
const { id } = await params;
```

Remember: **Always await params in Next.js 15!** 🚀

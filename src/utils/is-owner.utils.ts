

export function isOwner(
    author: string, 
    userId: string
) : boolean
{
    return author === userId;
}
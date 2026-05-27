# Deploy to Railway
1. Run `ps aux | grep telegram` and kill any stale processes
2. Verify the correct Railway project with `railway status`
3. Run `railway up` and monitor logs with `railway logs --tail`
4. Confirm deployment is healthy before reporting success
Never assume Vercel. Always Railway.

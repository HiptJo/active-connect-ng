[![Run Jest Tests](https://github.com/HiptJo/active-connect-ng/actions/workflows/test.yml/badge.svg?branch=master)](https://github.com/HiptJo/active-connect-ng/actions/workflows/test.yml)

# Active-Connect

Connection framework built for smart web-based projects using NodeJS, Angular and Websockets.

This package can be used to integrate angular.

This project is developed right now. Stay tuned.

# Decorators

## Annotations

```javascript
@Route("route.child")
public async func(data: any):Promise<any> {
    // do something befor executing the method
    return new Promise(resolve => {
        // do something after executing the method
    })
}
```

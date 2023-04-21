package enfercuidarte;

import io.micronaut.http.annotation.*;

@Controller("/")
public class TestController {

    @Get(uri = "/", produces = "text/plain")
    public String index() {
        return "Bienvenido a la API de enfercuidarte";
    }

    @Get(uri = "/{name}", produces = "text/plain")
    public String getNombre(@PathVariable String name) {
        return "hola " + name;
    }

    @Post(uri = "/", produces = "text/plain")
    public String postNombre() {
        return "Creando usuario";
    }
}
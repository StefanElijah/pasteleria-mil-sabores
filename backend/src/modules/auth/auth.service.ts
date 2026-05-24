import { Injectable, Inject, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import { CartService } from '@modules/sales/cart/cart.service';

@Injectable()
export class AuthService {
    constructor(
        @Inject('PrismaClient') private prisma: any,
        private jwtService: JwtService,
        private cartService: CartService,
    ) { }

    async validateUser(email: string, password: string) {
        const user = await this.prisma.usuario.findUnique({ where: { email } });
        if (user && (await bcrypt.compare(password, user.password))) {
            const { password: _, ...result } = user;
            return result;
        }
        return null;
    }

    async login(loginDto: LoginDto, anonCartId?: string) {
        const user = await this.validateUser(loginDto.email, loginDto.password);
        if (!user) throw new UnauthorizedException('Credenciales incorrectas');
        // Fusionar carrito anónimo si existe
        if (anonCartId && anonCartId.startsWith('anon_')) {
            await this.cartService.mergeCarts(anonCartId, user.id);
        }
        const payload = { sub: user.id, email: user.email, rol: user.rol };
        return {
            access_token: this.jwtService.sign(payload),
            user,
        };
    }

    async register(registerDto: RegisterDto) {
        const { email, password, primerNombre, primerApellido, segundoNombre, segundoApellido } = registerDto;
        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = await this.prisma.usuario.create({
            data: {
                email,
                password: hashedPassword,
                rol: 'CLIENTE',
                estado: 'ACTIVO',
                primerNombre,
                primerApellido,
                segundoNombre: segundoNombre || null,
                segundoApellido: segundoApellido || null,
                perfilCliente: {
                    create: {},
                },
            },
            include: { perfilCliente: true },
        });

        const { password: _, ...userWithoutPassword } = newUser;
        return userWithoutPassword;
    }
}
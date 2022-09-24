import nodemailer from "nodemailer";
import handlebars from "handlebars";
import fs from "fs";
import { ElementToSendInterface } from "../interfaces/client.interface";

export class EmailSenderService {
    private transporter: nodemailer.Transporter<unknown>;
    
    constructor() {
        const config = {
            host: process.env.SMTP_HOST,
            port: Number(process.env.SMTP_PORT),
            auth: {
                user: process.env.SMTP_USER,
                pass: process.env.SMTP_PASSWORD
            }
        };
        console.log("ETAPE 1");
        this.transporter = nodemailer.createTransport(config);
        console.log("ETAPE 2");
    }

    private checkEmailAvailability(): Promise<unknown> {
        return new Promise<unknown>((resolve, reject) => {
            this.transporter.verify((error, success) => {
                return error ? reject(error) : resolve(`Mailer is ready to take messages: ${success}`);
            });
        });
    }
    
    sendMail(platform: string, subject: string) {
        this.checkEmailAvailability().then(res => {
            console.log(res);
            const datas: ElementToSendInterface[] = JSON.parse(fs.readFileSync(`data/cache.${platform}.json`, { encoding: "utf8" }));
    
            const templateRead = fs.readFileSync(`src/templates/email.${platform}.template.hbs`, { encoding: "utf8" });
            const datasToCompile = this.filterDatasByDate(datas);
    
            const template = handlebars.compile(templateRead);
            const templateToSend = template(datasToCompile);
    
            console.log("ETAPE 4");
            const mailOptions = {
                sender: "Free Games Catcher",
                from: "noreply@sizeup.cloud",
                to: "francisco59553@gmail.com",
                subject: subject,
                html: templateToSend,
            };
            
            this.transporter.sendMail(mailOptions, (error, data) => {
                error ? console.log(`Error : ${error}`) : console.log("Email sent !");
            });
        });
    }

    private filterDatasByDate(datas: ElementToSendInterface[]) {
        interface datasToCompileInterface {
            availableGames: ElementToSendInterface[]
            nextGames: ElementToSendInterface[]
        }
        
        const datasToCompile: datasToCompileInterface = {
            availableGames: [],
            nextGames: []
        };


        datas.forEach(element => {
            const gameStartDate = new Date(element.promotion.startDate);
            if (gameStartDate > new Date()) {
                datasToCompile.nextGames.push(element);
            } else {
                datasToCompile.availableGames.push(element);
            }

            element.promotion.endDate = Intl.DateTimeFormat("en-GB")
                .format(new Date(element.promotion.endDate))
                .split("/").join(" / ");

            element.promotion.startDate = Intl.DateTimeFormat("en-GB")
                .format(new Date(element.promotion.startDate))
                .split("/").join(" / ");
        });

        return datasToCompile;
    }

}
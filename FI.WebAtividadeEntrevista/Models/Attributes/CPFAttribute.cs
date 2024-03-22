using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Web;

namespace WebAtividadeEntrevista.Models.Attributes
{
    [AttributeUsage(AttributeTargets.Property | AttributeTargets.Field | AttributeTargets.Parameter, AllowMultiple = false)]
    public class CPFAttribute : ValidationAttribute
    {
        public override bool IsValid(object value)
        {
            var cpf = value as string;
            if (cpf == null)
                return false;

            cpf = cpf.Replace(".", "").Replace("-", "");

            if (cpf.Length != 11 || cpf == "00000000000" || cpf == "11111111111" || cpf == "22222222222" ||
                cpf == "33333333333" || cpf == "44444444444" || cpf == "55555555555" || cpf == "66666666666" ||
                cpf == "77777777777" || cpf == "88888888888" || cpf == "99999999999")
                return false;

            int soma = 0;
            for (int i = 0; i < 9; i++)
                soma += int.Parse(cpf[i].ToString()) * (10 - i);

            int resto = soma % 11;
            if (resto < 2)
            {
                if (int.Parse(cpf[9].ToString()) != 0)
                    return false;
            }
            else
            {
                if (int.Parse(cpf[9].ToString()) != 11 - resto)
                    return false;
            }

            soma = 0;
            for (int i = 0; i < 10; i++)
                soma += int.Parse(cpf[i].ToString()) * (11 - i);

            resto = soma % 11;
            if (resto < 2)
            {
                if (int.Parse(cpf[10].ToString()) != 0)
                    return false;
            }
            else
            {
                if (int.Parse(cpf[10].ToString()) != 11 - resto)
                    return false;
            }

            return true;
        }

    }
}
<?php

namespace App\Entity;

use App\Entity\User;
use Doctrine\ORM\Mapping as ORM;
use ApiPlatform\Core\Annotation\ApiFilter;
use ApiPlatform\Core\Annotation\ApiResource;
use Symfony\Component\Serializer\Annotation\Groups;

use Symfony\Component\Validator\Constraints\Type;
use Symfony\Component\Validator\Constraints\Choice;
use Symfony\Component\Validator\Constraints\DateTime;
use Symfony\Component\Validator\Constraints\NotBlank;
use Symfony\Component\Validator\Constraints as Assert;

use ApiPlatform\Core\Bridge\Doctrine\Orm\Filter\OrderFilter;

/**
 * @ORM\Entity(repositoryClass="App\Repository\InvoiceRepository")
 * @ApiResource(
 *   subresourceOperations={
 *     "api_customers_invoices_get_subresource"={
 *       "normalization_context"={
 *         "groups"={
 *           "invoices_subresource"
 *         }
 *       }
 *     }
 *   },
 *   itemOperations={
 *     "GET",
 *     "PUT",
 *     "DELETE",
 *     "increment"={
 *       "method"="post",
 *       "path"="/invoices/{id}/increment",
 *       "controller"="App\Controller\InvoiceIncrementationController",
 *       "openapi_context"={
 *         "summary"="Invoice chrono incrementation",
 *         "description"="Increments invoice chrono"
 *       }
 *     }
 *   },
 *   attributes={
 *     "pagination_enabled"=true,
 *     "pagination_items_per_page"=5,
 *     "order":{"amount":"asc"}
 *   },
 *   normalizationContext={
 *     "groups"={"invoices_read"}
 *   },
 *   denormalizationContext={
 *     "disable_type_enforcement"=true
 *   }
 * )
 * @ApiFilter(OrderFilter::class, properties={"amount", "sentAt"})
 */
class Invoice
{
    /**
     * @ORM\Id()
     * @ORM\GeneratedValue()
     * @ORM\Column(type="integer")
     * @Groups({"invoices_read", "customers_read", "invoices_subresource"})
     */
    private $id;

    /**
     * @ORM\Column(type="float")
     * @Groups({"invoices_read", "customers_read", "invoices_subresource"})
     * @Assert\NotBlank(message="Le montant de la facture est obligatoire")
     * @Assert\Type(type="numeric", message="Le format du montant de la facture est incorrect")
     */
    private $amount;

    /**
     * @ORM\Column(type="datetime")
     * @Groups({"invoices_read", "customers_read", "invoices_subresource"})
     * @Assert\Type(
     *  type = "\DateTime",
     *  message = "La date renseignée doit être au format YYYY-MM-DD..."
     * )
     */
    private $sentAt;

    /**
     * @ORM\Column(type="string", length=255)
     * @Groups({"invoices_read", "customers_read", "invoices_subresource"})
     * @Assert\Notblank(message="Le status de la facture est obligatoire")
     * @Assert\Choice(choices={"SENT", "PAID", "CANCELLED"}, message="Le status de la facture n'est pas conforme")
     */
    private $status;

    /**
     * @ORM\ManyToOne(targetEntity="App\Entity\Customer", inversedBy="invoices")
     * @ORM\JoinColumn(nullable=false)
     * @Groups({"invoices_read"})
     * @Assert\NotBlank(message="Le client doit être fourni")
     */
    private $customer;

    /**
     * @ORM\Column(type="integer")
     * @Groups({"invoices_read", "customers_read", "invoices_subresource"})
     * @Assert\NotBlank(message="Le numéro de chrono doit être fourni")
     * @Assert\Type(type="numeric", message="Le numéro de chrono doit être un nombre entier")
     */
    private $chrono;

    /**
     * Permet de récupérer le User auquel appartient la facture
     * 
     * @Groups({"invoices_read", "invoices_subresource"})
     * @return User 
     */
    public function getUser(): User
    {
        return $this->customer->getUser();
    }

    public function getId(): ?int
    {
        return $this->id;
    }

    public function getAmount(): ?float
    {
        return $this->amount;
    }

    public function setAmount($amount): self
    {
        $this->amount = $amount;

        return $this;
    }

    public function getSentAt(): ?\DateTimeInterface
    {
        return $this->sentAt;
    }

    public function setSentAt(\DateTimeInterface $sentAt): self
    {
        $this->sentAt = $sentAt;

        return $this;
    }

    public function getStatus(): ?string
    {
        return $this->status;
    }

    public function setStatus(string $status): self
    {
        $this->status = $status;

        return $this;
    }

    public function getCustomer(): ?Customer
    {
        return $this->customer;
    }

    public function setCustomer(?Customer $customer): self
    {
        $this->customer = $customer;

        return $this;
    }

    public function getChrono(): ?int
    {
        return $this->chrono;
    }

    public function setChrono($chrono): self
    {
        $this->chrono = $chrono;

        return $this;
    }
}
